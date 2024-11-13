**TLDR;** This blogpost is about the scope of my [thesis](https://github.com/D2LAB-UGent/Simreal/blob/main/doc/Adaptive_Domain_Randomization_for_Sim_to_Real_transfer_in_Mechatronic_Systems.pdf) at Ghent University under Guillaume Crevecoeur. It aims to address the difficulties of policy transfer from simulation to reality and has a very specific focus on control policies for mechatronic systems. Adaptive domain randomization is implemented in an open-source library called simreal, hosted on the [university’s github](https://github.com/D2LAB-UGent/Simreal).

<br>
<hr>
<br>

*While the idea behind Reinforcement Learning for mechatronic systems is appealing, it struggles to find its way into an industrial setting. It is difficult to scale the expensive training process, to define an appropriate reward function or even to make a reliable observation. All factors that lead to control policies that are not robust enough for the real world. However, a possible solution might be within reach. With a [proven record](https://arxiv.org/abs/1703.06907) in computer vision, domain randomization is making its entrance in sim-to-real transfer for mechatronic systems.*

<br>

## Reinforcement Learning

Solving continuous control problems using reinforcement learning has seen growing interest the past years. The idea is very appealing. By conducting a lot of experiments the controller is rewarded for actions that have led to good results, after which it is more  or less likely to repeat some specific behavior.

<br>

In reinforcement learning the controller is called an agent and is often represented by a neural network. Due to the vast amount of experiments needed to reach the desired performance, training is done using a digital twin. A simulated environment alleviates the need for real word training and provides data that is cheap, fast and easy to acquire. However, an agent that performs well in simulation does not always work on a real mechatronic system. Policy transfer from simulation to reality is not obvious because of a phenomenon known as the reality gap. Much effort can be put into perfecting and identification of a digital twin but one can never model every aspect of the real system. Reality remains unpredictable, noisy and full of other unexpected influences. 

<br>

Meet [domain randomization](https://ieeexplore.ieee.org/document/8460528). By presenting a lot of unexpected scenarios during the training stage, domain randomization aims to make the control policies more robust in the real world. Certain environment parameters are randomized and sampled from a Gaussian distribution and it turns out that determining these distributions for optimal policy transfer can be a very tedious process. In my opinion adaptive domain randomization can be a good solution for [automating this process](https://arxiv.org/abs/1910.07113).

<br>

## Domain Randomization

We kicked off by choosing two proven and stable reinforcement learning baselines: [SAC](https://arxiv.org/abs/1801.01290) & [PPO](https://arxiv.org/abs/1707.06347). The implementation of these algorithms is based on [lagom](https://github.com/zuoxingdong/lagom), a PyTorch based library that is built for rapid prototyping of new concepts. 

<br>

As for the environments, [OpenAI Gym](https://github.com/openai/gym) provides dozens of open source environments that are easy to interpret and flexible to customize.Three environments were isolated, customized and added to the registry: CustomCartPole-v1, CustomPendulum-v0 and CustomAcrobot-v1.

<br>
<div class="flex justify-center">

![gym-envs](/blogs/sim2real-transfer-in-mechatronic-systems/gym-envs.png)

</div>
<br>

With domain randomization, certain environment parameters are randomized during the training process. Note that the parameters used for randomization are different for each unique environment. But within the simreal library it is very easy to add new randomization parameters

<br>

<div style="display: flex; justify-content: center;">
  <table style="border-collapse: collapse; text-align: center; width: 80%;">
    <thead>
      <tr style="border-bottom: 2px solid black;">
        <th style="padding: 6px; width: 33%;">CartPole</th>
        <th style="padding: 6px; width: 33%;">Pendulum</th>
        <th style="padding: 6px; width: 33%;">Acrobot</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 6px;">mass cart: m<sub>c</sub></td>
        <td style="padding: 6px;">mass: m</td>
        <td style="padding: 6px;">mass rod 1: m<sub>1</sub></td>
      </tr>
      <tr>
        <td style="padding: 6px;">mass pole: m<sub>p</sub></td>
        <td style="padding: 6px;">length: l</td>
        <td style="padding: 6px;">mass rod 2: m<sub>2</sub></td>
      </tr>
      <tr>
        <td style="padding: 6px;">length pole: l<sub>p</sub></td>
        <td style="padding: 6px;"></td>
        <td style="padding: 6px;">length rod 1: l<sub>1</sub></td>
      </tr>
      <tr>
        <td style="padding: 6px;"></td>
        <td style="padding: 6px;"></td>
        <td style="padding: 6px;">length rod 2: l<sub>2</sub></td>
      </tr>
    </tbody>
  </table>
</div>

<br>

Two main arguments define how the domain parameters are randomized during the training process: **Probability distribution characteristics** (mean and standard deviation) & **Randomization frequency**.

<br>

1. <u>Probability distribution characteristics</u>

    <br>

    The domain parameters are sampled from a Gaussian distribution. Therefore, two characteristics are required for each domain parameter (e.g. 𝝁 and 𝝈). The probability distribution characteristics are summarized in a matrix ϕ. An example for the Pendulum environment is given below.

    <br>
    <div class="flex justify-center">

    ![phi_pendulum](/blogs/sim2real-transfer-in-mechatronic-systems/phi_pendulum.png)

    </div>
    <br>

2. <u>Randomization frequency</u>

    <br>

    Secondly, the randomization frequency is defined by two arguments: **Frequency** & **Type**, which is either every episode or every variation and. For example, one configuration might be (50, every variation), which triggers a randomization of the domain parameters every 50th step in the environment. 

<br>

*Time for some examples:*

<br>

<div class="flex justify-center space-x-4">
  <img src="/blogs/sim2real-transfer-in-mechatronic-systems/domain-randomizer_cart.gif" alt="cart" class="w-1/3">
  <img src="/blogs/sim2real-transfer-in-mechatronic-systems/domain-randomizer-pendulum.gif" alt="pendulum" class="w-1/3">
  <img src="/blogs/sim2real-transfer-in-mechatronic-systems/acrobot-env.gif" alt="acrobot" class="w-1/3">
</div>

<br>


With the simreal library available in git, you can easily use domain randomization as follows:

```
env = simreal.make('CustomAcrobot-v1')
env = DomainRandomization(env, args)
```

If you are interested in the implementation architecture then you should definitely check out the github. Simply represented, it looks like this:

<br>
<div class="flex justify-center">

![total-architecture](/blogs/sim2real-transfer-in-mechatronic-systems/total-architecture.png)

</div>
<br>

Note that it is possible to provide a different evaluation environment with the reinforcement learning engine. This allows for connecting a realistic environment at this location. To enable fast evaluation, one can also add an evaluation environment that is a more complex version of the simulated one. Reality is imitated by adding noise and friction to the standard environment by means of a Noisy wrapper.

```
env = Noisy(
    env,
    max_actuation_noise_perc = 2,
    max_observation_noise_perc = 2,
    max_offset_perc= 0,
    friction = 0.01
)
```

As you can see actuation & observation noise, parameter offsets and friction are added to the three implemented environments.

<br>

## The problem of Domain Randomization

So are we there already? Did we close the reality gap here? Not completely… Successful policy transfer this way is irregular and unreliable. It is remarkably dependent on the randomization seed, and we have no idea whether the used distribution characteristics are optimal. Maybe we randomize the length of the rod too much, maybe too little, who knows?

<br>
<div class="flex justify-center">

![phi_more](/blogs/sim2real-transfer-in-mechatronic-systems/phi_more.png)

</div>
<br>

You could just try out some values. Meaning to fill in some value for the mean and standard deviation for every randomization parameter and see what works best. But this becomes a very lengthy process when the dimensionality of the problem increases. The amount of possible combinations for an increasing number of randomization parameters just explodes. So how do we find these optimal distribution characteristics ϕ in a more complex setting?

<br>

## Adaptive Domain Randomization (ADR)

Simply put: ADR’s goal is to optimize and automate the tedious process of finding the best distribution characteristics that lead to optimal policy transfer. It achieves this by optimizing the characteristics in between sessions of the RL training process and is inspired by [this paper](https://ieeexplore.ieee.org/document/8793789). If that made no sense, let me walk you through the following figure:   

<br>
<div class="flex justify-center">

![ADR-framework](/blogs/sim2real-transfer-in-mechatronic-systems/ADR-framework.png)

</div>
<br>

- We start with an initial ϕ<sub>0</sub> and we train a policy that uses domain randomization.
- After T training steps we interrupt reinforcement learning training. That policy 𝜋<sub>i</sub> is used to compute some trajectories in reality 𝜏<sub>real</sub> and (much more) in the randomized simulation environment 𝜏<sub>ξ</sub>. 
- Now we compare the trajectories in reality with those in simulation by means of a discrepancy function D(𝜏<sub>ξ</sub> ,𝜏<sub>real</sub>) . 
- The simulation trajectories that led to the smallest discrepancy between simulation and reality are kept aside. And it is the environment parameters that were responsible for generating these trajectories that form the basis for the ϕ<sub>i+1</sub> of the next iteration. 

<br>

The optimization algorithm used for this purpose is the Cross Entropy Method (CEM) but going into more detail here would lead us too far. If you are interested, there is more information about this in [the docs](https://github.com/D2LAB-UGent/Simreal/blob/main/doc/Adaptive_Domain_Randomization_for_Sim_to_Real_transfer_in_Mechatronic_Systems.pdf) on git.

<br>

To finish off, here is some pseudocode of ADR:

```
init: config_RL
init: config_CEM
init: ϕ0
init: real_env, train_env, eval_env = make_envs()

while True:
      𝜋i+1 = RL(config_RL, ϕ0, 𝜋i)
      if iter > iter_max:
            break

      ϕi+1 = CEM(config_CEM, ϕi , 𝜋i+1)
      iter += 1
```

<br>

## So, what's next?

Deploying reinforcement learning controllers for mechatronic systems in the real world is a novel, appealing and very promising idea. Domain randomization provides a possible solution to close the reality gap when the agent is trained in a simulated environment. To be fair, it is too early to generalize this here to the majority of mechatronic systems. This would require testing of agents in reality for several different mechatronic systems and tasks. However, I truly believe that one day we’ll get there. Let simreal lower the barrier a bit to test it out for yourself.

<br>
<hr>
<br>

**Recognition:**

These implementations are part of my master’s thesis at Ghent University and I would never have gotten this far without the help of Guillaume Crevecoeur and Jeroen Taets. Thank you for the expertise and guidance through this complex subject and I really appreciate the approval and effort to make it open-source.

<br>

**References:**

- *Tobin, J., Fong, R., Ray, A., Schneider, J., Zaremba, W. and Abbeel, P. (2017). Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World. arXiv:1703.06907 [cs]. [online] Available at: https://arxiv.org/abs/1703.06907 .*

- *Peng, X.B., Andrychowicz, M., Zaremba, W. and Abbeel, P. (2018). Sim-to-Real Transfer of Robotic Control with Dynamics Randomization. [online] IEEE Xplore. doi:10.1109/ICRA.2018.8460528.*

- *‌OpenAI, Akkaya, I., Andrychowicz, M., Chociej, M., Litwin, M., McGrew, B., Petron, A., Paino, A., Plappert, M., Powell, G., Ribas, R., Schneider, J., Tezak, N., Tworek, J., Welinder, P., Weng, L., Yuan, Q., Zaremba, W. and Zhang, L. (2019). Solving Rubik’s Cube with a Robot Hand. [online] arXiv.org. Available at: https://arxiv.org/abs/1910.07113 .*

- ‌*Haarnoja, T., Zhou, A., Abbeel, P. and Levine, S. (2018). Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor. arXiv:1801.01290 [cs, stat]. [online] Available at: https://arxiv.org/abs/1801.01290 .*

- *Schulman, J., Wolski, F., Dhariwal, P., Radford, A. and Klimov, O. (2017). Proximal Policy Optimization Algorithms. [online] arXiv.org. Available at: https://arxiv.org/abs/1707.06347 .*

- *Zuo, X. (2022). zuoxingdong/lagom. [online] GitHub. Available at: https://github.com/zuoxingdong/lagom  [Accessed July. 2021].*

- *Chebotar, Y., Handa, A., Makoviychuk, V., Macklin, M., Issac, J., Ratliff, N. and Fox, D. (2019). Closing the Sim-to-Real Loop: Adapting Simulation Randomization with Real World Experience. [online] IEEE Xplore. doi:10.1109/ICRA.2019.8793789.*

<br>