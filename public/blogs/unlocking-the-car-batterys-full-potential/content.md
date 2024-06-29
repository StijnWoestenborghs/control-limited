**TLDR;** An article about an iterative machine learning approach to State of Charge estimation of a battery cell, combined with a discussion of the advantages over traditional approaches. The post is backed by a series of experiments wich can be followed in code in the corresponding [github repository](https://github.com/StijnWoestenborghs/state-of-charge-estimation).

<br>
<hr>
<br>

*The rising efficiency and energy density of Li-ion batteries is driving an exciting wave of innovation that is affecting everyone's lives. Home batteries, smart-grid technology, electric vehicles…  An increasing number of people are adopting its benefits and using them daily. Furthermore, the technological advances that are coming in the next few years will make an even bigger impact. Extended EV ranges, increasing electrification, and yes… [flying cars are coming](https://lilium.com/newsroom-detail/liliums-battery-strategy) and are currently being devolved.*

<br>

*One element in fully unlocking a battery's potential, is to estimate exactly how much charge remains. Although seemingly trivial to many, it is not a value one can just read off the battery pack. Furthermore, needless to say that to ensure a safe and reliable operation of these technologies, accurate state of charge (SoC) estimations is vital.*

<br>

## Conventional Methods vs Machine Learning


Let’s have a closer look at this problem. When observing some experimental data of a battery cell, one quickly recognises that there are many factors that make this problem extremely complex.

<br>

- High dynamic load demands when, for example, driving the vehicle.
- Highly non-linear relationships between the observable signals of the battery like voltage/dis-charge currents and the SoC.
- Changing behaviour for varying battery temperatures.
- …

<br>

And of course, this is not a new problem. There are many methods of monitoring the state of charge of a Li-ion batteries. [[source](https://www.sciencedirect.com/science/article/abs/pii/S0378775314002572)] The essence is that most of these methods **rely on a physical model** of the battery pack. Afterwards, the parameters of these models are being fitted on actual measurement data. A classical example of **System Identification**. In addition, based on that battery model, **(Extended) Kalman Filters** make an excellent choice for accurate State of Charge estimation because it deals quite well with highly non-linear dynamics and noisy measurements.

<br>

However, the performance of all these methods is **limited to what is reflected in the system model**. Often changes in environment are not included or not modelled very well for a complex system such as this one. Additionally, Extended Kalman Filters require a linearization around an operating point which can be a **computational burden** for the underlying embedded system.

<br>

The solution? Machine Learning of course! Deep learning models can be trained to be robust against measurement errors and have the ability of online learning so that they can **adapt to new and changing environments**. Additionally you apply transfer learning for a specific battery cell and other fine tune techniques to further improve the accuracy. Let’s explore…

<br>

## Machine Learning Approach


Like every ML project we start by exploring the dataset, dividing it into a train- and evaluation-set and do some pre-processing. The remainder of this blog post explains some conducted experiments, which you can also follow in code in the corresponding repo. In short it will touch upon the training of a baseline model, some feature engineering, and a hyperparameter optimization for learning rate and model architecture.

<br>
<div class="flex justify-center">

![ML-approach](/blogs/unlocking-the-car-batterys-full-potential/ML-approach.png)

</div>
<br>

The data that was used comes from a Panasonic 18650PF cell that was tested at the University of Wisconsin-Madison. They tested a series of different pulse, (dis-)charge and drive cycle tests under different temperatures conditions. For completeness, the dataset is included in the corresponding [git repository](https://github.com/StijnWoestenborghs/state-of-charge-estimation).

<br>

#### A) Training the Baseline


The baseline and starting point for this project was inspired by [this paper](https://www.sciencedirect.com/science/article/abs/pii/S0378775318307080). They propose a simple 3-layer DNN model with 4 input features: Battery temperature, open circuit voltage and a moving average of the discharge current and voltage over 400 timesteps. This would look something like this:

<br>
<div class="flex justify-center">

![model-baseline](/blogs/unlocking-the-car-batterys-full-potential/model-baseline.png)

</div>
<br>


Just like all experiments, the training data of the baseline was logged to tensorboard and one can simply inspect them by running:  `tensorboard --logdir ./logs/<experiment-name>`
Finally, the model was evaluated on the Mean Average Error (MAE) of some unique Drive Cycles. As visualized in the figure below, the SoC is predicted given the input signals and evaluated against the actual SoC. For the baseline this resulted in
a **MAE of 2.182%**. Without spending too much time on these results, let’s move on the feature engineering.

<br>
<div class="flex justify-center">

![baseline-performance](/blogs/unlocking-the-car-batterys-full-potential/baseline-performance.png)

</div>
<br>


#### B) Feature Engineering

In this step one tries to extract important features from the raw data and find/transform the feature to have the strongest correlation with the SoC. As a start, we apply normalisation to every feature. Next, one can investigate the feature importance of a lot of different values derived from the dataset. A total of 20 features were evaluated:

<br>

- Voltage, Current, Power and Battery Temperatures
- Derivatives of the Voltage, Current, Power and Battery Temperatures
- Moving averages of Voltage and Current across a lot of different timesteps.

<br>
<div class="flex justify-center">

![model-feature-all](/blogs/unlocking-the-car-batterys-full-potential/model-feature-all.png)

</div>
<br>

The feature importance of this set was calculated using the [Shapley](https://shap.readthedocs.io/en/latest/index.html) library. From the figure below, one can clearly see that the gradient features have no impact at all on the model output. Hence, they are dropped from subsequent iterations. In general, reducing the number of features is a good idea to help improve model interpretability, reduce overfitting, and decrease training time. After evaluating the resulting model again, we are now at a **MAE of 1.550%**. A considerable improvement w.r.t. the baseline. 

<br>
<div class="flex justify-center">

![shapley-feature-importance](/blogs/unlocking-the-car-batterys-full-potential/shapley-feature-importance.png)

</div>
<br>

#### C) Hyperparameter optimization (Learning Rate)

The hyperparameter optimization involves training of multiple models with different model parameter configurations. To start out easy, the loss of **100 models** is minimised using only the **learning rate** as a configurable parameter. The [Ray Tune](https://docs.ray.io/en/latest/tune/index.html) library was used here to automate and parallelise this process. When looking at the tensorboard training logs, one can nicely see the different learning rates visualised. Also notice the early stopping of underperforming models that was set up to save resources during the optimization.

<br>
<div class="flex justify-center">

![hyper-learning-curves](/blogs/unlocking-the-car-batterys-full-potential/hyper-learning-curves.png)

</div>
<br>

The best of all models results in an **MAE of 1.097%**. Again, a remarkable improvement over the previous iteration. However, it also raises new questions. Are there better ways to assess model performance? Where exactly is the model failing? In what areas can we still work to improve the model? All these questions and the need for need for more insights have led to the following figure.

<br>
<div class="flex justify-center">

![annotated-contour](/blogs/unlocking-the-car-batterys-full-potential/annotated-contour.png)

</div>
<br>

With Temperature on the x-axis, SoC on the y-axis and Absolute Error on the z-axis, we can identify two areas with decreasing model performance:

<br>

- The entire -10 °C to 0 °C temperature range
- Decreasing performance for low SoC and higher temperatures.

<br>

When thinking about the requirements, it is problematic that performance drops for low SoC values. Actually, one needs more accurate predictions when the battery is running low. An area that definitely needs some improvement. Additionally, we also need to examine more closely what exactly is going wrong in the -10 °C to 0 °C temperature range.

<br>

#### D) Hyperparameter optimization (DNN Model Architecture)

The second experiment around hyperparameter optimization concerns the DNN model architecture. Again, **100 models** were trained but now each model has a different configuration of **number of hidden layers** and their corresponding **layer sizes**. All the samples are uniformly distributed in number of layers between 2 and 10 using layer sizes as one of [16, 32, 64, 128, 256].

<br>
<div class="flex justify-center">

![model-architecture](/blogs/unlocking-the-car-batterys-full-potential/model-architecture.png)

</div>
<br>

After training, the best performing model had 8 hidden layers and is therefore also quite a bit larger than previous models. Evaluating the model resulted in an **MAE of 0.974%** which (based on [reported results in literature](https://www.sciencedirect.com/science/article/abs/pii/S1364032119304332)) is comparable with the Extended Kalman Filter (EKF). Note that these numbers should be compared only when tested on the same evaluation data. However, without drawing any conclusions, they indicate a promising direction.

<br>

More importantly is to see that the absolute error of the model has decreased a lot!

<br>
<div class="flex justify-center">

![area-of-error-3](/blogs/unlocking-the-car-batterys-full-potential/area-of-error-3.png)

</div>
<br>

The same areas appear when it comes to model performance: Low SoC, high temperatures. Which again, should be given extra attention in future iterations. An interesting discovery is that the distribution of the errors off the model is totally skewed in the -10 °C to 0 °C range. While in every other temperature range the errors are nicely normally distributed (left), between -10 °C and 0 °C the model is much more likely to overestimate the SoC (right).

<br>

<div class="flex justify-center space-x-4">
  <img src="/blogs/unlocking-the-car-batterys-full-potential/error_distribution_10degC.png" alt="error_distribution_10degC" class="w-1/2">
  <img src="/blogs/unlocking-the-car-batterys-full-potential/error_distribution_-10degC.png" alt="error_distribution_-10degC" class="w-1/2">
</div>

<br>

## So, what's next?

First of all, the results here are already satisfying. But there are many more iterations one can do to keep on improving on model performance. It is really a problem that may require several months to fully align with all the necessary requirements. Just before letting you go, here is a final brain dump:

<br>

- Going back to the data
    - Investigate the -10 °C dataset
    - Acquire more data for different types of battery cells
- Evaluate the model on conventional methods (EKF) on the same evaluation data
- New model architectures:
    - Bigger models. Include dropout, L1/L2 Regularization to avoid overfitting
    - Include history (RNN, LSTM or GRU architectures)
    - SOTA attention-based transformer models [[source](https://www.nature.com/articles/s41598-021-98915-8)]
- Optimize for computational load (when going to embedded devices)
    - Decreasing model size while minimizing decrease in model performance
    - Combination of different models in different operational areas
- Transfer learning for different battery cells
- Online learning when a specific cell is in operation


<br>
<hr>
<br>

**References:**

<br>

- *Waag, W., Fleischer, C. and Sauer, D.U. (2014). Critical review of the methods for monitoring of lithium-ion batteries in electric and hybrid vehicles. Journal of Power Sources, 258, pp.321–339. doi:https://doi.org/10.1016/j.jpowsour.2014.02.064.*

- *Chemali, E., Kollmeyer, P.J., Preindl, M. and Emadi, A. (2018). State-of-charge estimation of Li-ion batteries using deep neural networks: A machine learning approach. Journal of Power Sources, [online] 400, pp.242–255. doi:https://doi.org/10.1016/j.jpowsour.2018.06.104.*

- *Shrivastava, P., Soon, T.K., Idris, M.Y.I.B. and Mekhilef, S. (2019). Overview of model-based online state-of-charge estimation using Kalman filter family for lithium-ion batteries.Renewable and Sustainable Energy Reviews, 113, p.109233. doi:https://doi.org/10.1016/j.rser.2019.06.040.*


- *Hannan, M.A., How, D.N.T., Lipu, M.S.H., Mansor, M., Ker, P.J., Dong, Z.Y., Sahari, K.S.M., Tiong, S.K., Muttaqi, K.M., Mahlia, T.M.I. and Blaabjerg, F. (2021). Deep learning approach towards accurate state of charge estimation for lithium-ion batteries using self-supervised transformer model.Scientific Reports, [online] 11(1), p.19541. doi:https://doi.org/10.1038/s41598-021-98915-8.*

<br>