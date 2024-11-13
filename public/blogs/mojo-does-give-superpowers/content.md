**TLDR;** Implementation of a simple gradient descent problem in Python, Numpy, JAX, C++ (binding with Python) and Mojo. My goal is to make a fair evaluation on the out-of-the-box, raw performance of a tech stack choice. Neither of the implementations is optimal. But what I hope to show is what execution speeds to expect out of the box, the complexity of each implementation and to pinpoint which ones have the possibility of squeezing out every bit of performance the hardware has to offer.

<br>
<hr>
<br>

Faster than Python, faster than Numpy, faster than JAX and faster than C++, is my experience when testing out Mojo for the first time. Seeing all the disruptions in the LLM space lately has been very interesting and it is not stopping. [Multimodal LLM’s](https://openai.com/index/chatgpt-can-now-see-hear-and-speak/) are about to be released and the idea of a [set of AI agents](https://github.com/OpenBMB/ChatDev) that prompt themselves is an interesting thought experiment in itself. What is not obvious at first sight is that all these advancements in the AI space are also powered by the ongoing disruptions underneath. And Mojo is definitely one of those.

<br>
<div class="flex justify-center">

![Flame](./blogs/mojo-does-give-superpowers/flame2.gif)

</div>
<br>
<br>

## A NEW PROGRAMMING LANGUAGE, WHY?

My roots are in machine learning on embedded devices and I still love the journey to deploy AI models and optimization algorithms on edge. In this kind of setting you absolutely care about performance and because of the lack of performance in Python I have been pushed to C++ or other alternatives multiple times. Every time it increases the complexity of a project drastically. Because once you realize that a ‘Python prototype’ isn’t going to cut it, you have to revise the tech stack completely, rewrite portions of your code or make complex bridges with some other language (like most high performance Python libraries do). But I also absolutely love Python: the efficient coding environment, short development cycles and easy evaluation/visualization of performance of the model is what gets your application deployed faster. And testing ideas quickly is key.

<br>

Then, a couple of months ago, [Modular](https://www.modular.com/) announced [Mojo](https://www.modular.com/max/mojo), a new programming language for AI developers that is on its journey to become a full superset of Python. It promises the usability of Python with the performance of C, while still having access to the complete Python ecosystem of libraries. As that doesn’t sound like the holy grail already, [this](https://www.modular.com/blog/how-mojo-gets-a-35-000x-speedup-over-python-part-1) blogpost series intrigued me to test it myself.

<br>

## GRADIENT DESCENT

The example implements a simple Numerical Optimization algorithm as this is one of the central techniques in Machine Learning. All the code for this post is available on [github](https://github.com/StijnWoestenborghs/gradi-mojo), so if you want, you are able to redo the experiments and create the visualizations yourself.

<br>

<div class="flex justify-center space-x-4">
  <img src="./blogs/mojo-does-give-superpowers/circle.gif" alt="Image 1" class="w-1/3">
  <img src="./blogs/mojo-does-give-superpowers/sphere.gif" alt="Image 2" class="w-1/3">
  <img src="./blogs/mojo-does-give-superpowers/modular3.gif" alt="Image 3" class="w-1/3">
</div>

<br>

Imagine having a drone swarm and you want to figure out their x, y and z coordinates of all of them. But you are only able to measure the distance between all the drones by calculating how long it takes to send and receive messages between each of them. 

Using gradient descent, one can solve for the coordinates of all the drones by minimizing loss function that punishes the difference between the estimation and your measurement. 

<br>

As the main goal here is to compare the performance of programming languages, I’m skipping over this quickly here but a detailed explanation on how it works is at the end. One important note that should be made here already is that the gradient was calculated using symbolic differentiation. This is different from automatic differentiation (the focus of JAX and what PyTorch & Tensorflow are using). But it makes the example more simple and more easy to implement.

<br>

## IMPLEMENTATIONS

My goal is to make a fair evaluation on the out-of-the-box, raw performance of a tech stack choice. Neither of the implementations is optimal. But what I hope to show is what **execution speeds to expect** out of the box, the complexity of each implementation and to pinpoint which ones have the **possibility of squeezing out every bit of performance** the hardware has to offer. That being said, these are the different ways the example was implemented:

<br>

- **<u>Python native</u>**: Only using libraries from the Python standard library. Although the python ecosystem is huge. It shows that these more performant libraries are using another higher formant language like C++ underneath. These libraries have taken the complexity away from you. 
- **<u>Python numpy</u>**: Well known Python library for matrix operations using C/Fortran in the backend. 
- **<u>JAX</u>**: XLA compiled Python code that is using JIT (just in time) compilation for high performance machine learning projects. JAX is great at automatic differentiation and compiling for CPU as well as other accelerators GPU & TPUs. So it’s important to take into consideration that we did calculate the gradient symbolically and are only running on CPU. 
- **<u>C++ binding (Eigen)</u>**: A custom setup C++ binding to Python. Calling the function from Python but using the C++ eigen-3.4.0 library underneath to carry out the gradient descent task. (Compiled with g++ and O3 compiler optimizations.) If you are interested in how this works: I have [another blogpost]() about just that.
- **<u>Mojo</u>** 🔥
- **<u>C++ binding (parallel gradient)</u>**: C++ allows for additional performance optimizations. The gradient descent algorithm allows calculating the gradient in parallel.
- **<u>Mojo (parallel gradient)</u>**: Same thing, Mojo allows for additional performance optimizations as well. The gradient can be calculated in parallel.

<br>

After implementing them, and running some tests with an increasing order of the problem and a consitent 1000 iterations each, this was the result. Specifically an increasing order here means increasing the number of points and an increasing dimensionality from 2D to 3D. Amazing to see that Mojo came out on top, every single time. And it was not just a little better. Note the logarithmic scale on the graph below.

<br>
<div class="flex justify-center">

![Measurements-log](./blogs/mojo-does-give-superpowers/measurements-log.png)

</div>
<br>

The parallelized implementations were the fastest except for low orders (N=10).  The machine I tested on had 20 logical CPUs available. I guess it doesn’t really make sense to fire 20 threads if the gradient only has 10 rows. Meaning, there is only a possibility of calculating 10 operations in parallel. 

<br>

In the higher order occasions (N=1000) Mojo outperformed Python by a factor of ~6000+ and Numpy by a factor of ~2500+. But to be fair we are not doing machine learning in native Python or Numpy today. So leaving these cases out and rescaling to a Linear y-scale again results in this.

<br>
<div class="flex justify-center">

![Measurements-linear](./blogs/mojo-does-give-superpowers/measurements-linear.png)

</div>
<br>

Having a look at some code snapshots gives an idea on how easy/complex it was to get there. It is almost incredible that Mojo is that much better, this easy. Giving more and more people the power to access the full potential of the hardware is transformational. Just imagine what it can do to the server cost of bigger and smaller AI companies. I guess Mojo does give you superpowers.






Again, be aware that none of the solutions are optimal, but it proves the main point. And yes, the language is still in early stages and lacks some notable features. But the [Mojo roadmap](https://docs.modular.com/mojo/roadmap) is for sure something to look forward to. **Mojo, you got me hooked.** 🔥

<br>

## THE GRADIENT DESCENT ALGORITHM

Digging a little deeper inside the gradient descent algorithm will explain why it is possible to calculate the gradient in parallel. So the goal is to figure out the coordinates X<sub>point</sub> = (x, y, z), but you are only able to measure the distance between each point individually. These measurements will get you a distance matrix which will look something like this. Here, the distance between a point and itself is always 0. And the distance between point 1 and point 2 is the corresponding D<sub>12</sub> .

<br>

<div class="flex justify-center space-x-4">
  <img src="./blogs/mojo-does-give-superpowers/Dmatrix.png" alt="Dmatrix" class="w-1/2">
  <img src="./blogs/mojo-does-give-superpowers/gradient-descent-2.png" alt="X" class="w-1/2">
</div>

<br>

Figuring out all the 3D coordinates of all points X can be solved by simply estimating their position, calculating the difference between each pair and comparing it with your measurement. A new estimate of X can be calculated using gradient descent. Taking a step in the negative gradient direction of the loss function.

<br>
<div class="flex justify-center">

![gd3](./blogs/mojo-does-give-superpowers/gradient-descent-3.png)

</div>
<br>

The loss function will look something like this:

<br>
<div class="flex justify-center">

![gd4](./blogs/mojo-does-give-superpowers/gradient-descent-4.png)

</div>
<br>

Where |X<sub>i</sub> - X<sub>j</sub>| is the estimated distance between 2 points and D<sub>ij</sub> the measured distance between each. So minimizing loss means minimizing the squared difference between your estimate and your measurement. 

<br>

The gradient can be calculated by automatic differentiation (as PyTorch and Tensorflow do) or by symbolically differentiating the loss function. I’m choosing for symbolic differentiation here as this reduces the time to implement this example. But already looking on how to try out autodiff as well. Looking at only one row at the time, each row of the gradient can be calculated independently:

<br>
<div class="flex justify-center">

![gd5](./blogs/mojo-does-give-superpowers/gradient-descent-5.png)

</div>
<br>

So the complete gradient matrix will be the following. 

<br>
<div class="flex justify-center">

![gd6](./blogs/mojo-does-give-superpowers/gradient-descent-6.png)

</div>
<br>

Note that because we can calculate each row of the gradient  independently this allows for parallel computation of the gradient. Which does play a crucial role in execution speed.

<br>
<hr>
<br>


**Recognition:**

I build this together with my friend [Cedric Van Heck](https://www.linkedin.com/in/cedric-van-heck-b673b918b/), who helped a lot in conceptualizing the post and implementing the JAX implementation. One can achieve so much more when multiple eyes are looking at the same problem.

<br>