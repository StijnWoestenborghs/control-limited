**TLDR;** This article is about some SOTA forecasting algorithms (TFT & DeepAR). Let's discuss why they are better then traditional methods and then apply them to a modern-day usecase: Predicting household electrical energy consumption. The article comes with an open-source [git repository](https://github.com/StijnWoestenborghs/energy-demand-forecasting) where you can follow my thoughts and have a look at the actual implementation.

<br>
<hr>
<br>

*The concepts of time series forecasting have been with us forever. It is no secret that improving the accuracy of demand forecasting is impactful in countless real world applications and sectors like retail, industry and finance. Yet, still people rely on traditional forecasting methods to make informed decisions. After reinforcement learning, computer vision & natural language processing, time series forecasting is next in line to be disrupted by deep learning technology.*

<br>

## Conventional vs Deep Learning

Traditional methods like [Simple/Exponential Moving Average](https://otexts.com/fpp2/moving-averages.html) and [Regression models](https://otexts.com/fpp2/regression.html) need no introduction. They are comprehensible, have a profound statistical foundation and are well-integrated in our society. Next to these, more sophisticated methods exist. While [Exponential Smoothing](https://otexts.com/fpp2/ses.html) models recognize trend and seasonality, [ARIMA](https://otexts.com/fpp2/arima.html) models aim to make predictions based on the autocorrelations in the data. Also derivatives of these models exist that have improved upon these concepts for specific applications. Take for example [Holt-Winters’ model](https://otexts.com/fpp2/holt-winters.html) and [seasonal-ARIMA](https://otexts.com/fpp2/seasonal-arima.html).

<br>

One could argue that Exponential Smoothing and ARIMA are the most widely used forecasting models today. Yet, in my opinion, they are limited in considering all relevant information. What if we are dealing with a much more complicated seasonal pattern? Take for example energy demand forecasting for individual households and think about how this involves a combination of hourly, daily, weekly and annual patterns. What about including indicative and highly correlated time series? There might be groups of households with similar behavior. Or think about how including a weather forecast can  improve the accuracy of predicting energy consumption.

<br>

Deep learning models like RNNs and CNNs are able to include parallel and highly correlated time series which can drastically increase model performance. Unlike traditional methods, they take into account all historical data and can be used to create a general model (e.g. one model to forecast energy demand in every household). On top of that, known categorical features can be included such as holidays, location, etc…

<br>

Take for example [Amazon’s DeepAR](https://docs.aws.amazon.com/sagemaker/latest/dg/deepar.html) which provides a hands-on implementation of a state of the art probabilistic RNN, also giving more information about the certainty of its prediction. Or an attention-based architecture can be found in the [Temporal Fusion Transformer](https://arxiv.org/abs/1912.09363) which enables multi-horizon forecasting. Rather than a one-step-ahead forecast, multi-horizon forecasts provide stakeholders with optimized information across multiple time steps in the future. Additionally, unlike a black-box neural network, the attention based approach provides explainability about how the model came to its prediction.

<br>

## Accelerated innovation: Smart meters

The smart meter introduces an exciting benchmark/milestone in grid technology. It provides many opportunities for innovation, energy efficiency, grid reliability and management. At the same time, solar panel owners are pushed to maximize their self-consumption through regulatory changes. So how can the smart meter benefit the consumer? Increasing his self-consumption through an energy demand forecast is one piece of a much more complex puzzle.

<br>

## Energy consumption data

Let us train an energy demand forecast model. The model was trained on a dataset that contains the energy consumption of 370 households (a [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets/ElectricityLoadDiagrams20112014)), from which, after a fast cleanup, 320 remained. The data was split up in 300 households for training and validation purposes and 20 for testing. All households contain 2 years of data (2012, 2013) with a minimum granularity of 15 min intervals. 

<br>

*One month of the test set:*

<br>
<div class="flex justify-center">

![forecasting-test-set](/blogs/the-future-of-time-series-forecasting/forecasting-test-set.png)

</div>
<br>

To understand the seasonal complexity of this problem, allow me to explain the following figure. (Credits to the authors of [this paper](https://www.mdpi.com/1996-1073/13/10/2672) for the inspiration of making it in the first place.)

Below, you see the average electricity consumption of all households combined. The data is visualized in weeks. While the x-axis represents the day & hour of the week, the y-axis indicates a specific week of 2012 & 2013 starting from the bottom.

<br>
<div class="flex justify-center">

![seasonality](/blogs/the-future-of-time-series-forecasting/seasonality.png)

</div>
<br>

Already from a first observation, you can clearly recognise seasonal patterns.
I am trying to list all the insights with a possible explanation:

<br>

:clock12: **Daily & Weekly patterns:** (from left to right :left_right_arrow:)

- Clearly people consume more electricity awake than asleep.
- When coming home from work around 6pm electricity consumption increases. 

<br>

:partly_sunny: **Seasonal patterns:** (from top to bottom :arrow_up_down:) 

- During hot summer months, e.g. airco’s consume a lot of energy. Even at night energy consumption during summer is higher than in winter. (A temperature forecast might be a very good indicator for energy consumption. Darker stripes could for example indicate very hot weeks.)
- During summer people live later and stay up longer than in winter. One can identify a kind of wavy energy increase in the evening.

<br>

:calendar: **Known categorical information:**

- New Year’s Eve: The night of 31 dec 2012 was a monday evening. 
- As mentioned in the description of the dataset. Every end of march and every end of october on a Sunday around 1-2am. There is a summer-, winter-hour time change. The electricity consumption is set to zero and aggregated over 2 hours respectively.

<br>
<br>

## Energy demand forecasting

Training is done in **stages** initiated by a configuration file *'src/config.json'*. This way of working allows for easy tracking of experiments. The pipeline can be controlled using the corresponding makefile and consist of the following stages:

<br>

- Preprocess
- Train (and validate)
- Test
- (optional) Animate 

<br>

After each stage all input/output is logged which makes it possible to interrupt, cache or pick-in a specific stage of the pipeline for a given experiment. 

<br>

It is worth mentioning that every trained model was taken out of the box. This project aims for finding general trends, not every model was optimized for maximum performance. Therefore, default model architectures are used and the only implemented feature is the time of day. Other features like day of week, day of year, weather forecasts … could further help the model recognizing weekly and yearly seasonality, but were not included here.

<br>

*The following figure is an example of an energy demand forecast (TFT):*

<br>
<div class="flex justify-center">

![forecasting-example](/blogs/the-future-of-time-series-forecasting/forecasting-example.png)

</div>
<br>

The zero time index indicates ‘now’ and every index represents 15 min. One can clearly see the
**prediction horizon** of 1 day, having a 7 days **context length**.

<br>

## A custom rolling metric

Deep learning models provide us with a forecast that is optimized across multiple timesteps in the future. This means that we can actually compute conventional metrics, like a Mean Average Error (MAE), for every single time step. However, if we want to evaluate the performance of a model, we should do so over an **extended period of time**. To give you an idea of what we are dealing with, here is an example.

<br>
<div class="flex justify-center">

![animation](/blogs/the-future-of-time-series-forecasting/animation.gif)

</div>
<br>

In short, at each timestep a MAE is calculated for each model prediction (up to a defined test horizon of interest). Then time is moved with a certain step size until the complete test length is covered. The final rolling metric is calculated by taking the average of all collected MAEs. A more complete implementation can be found in git.

<br>

*Pseudocode of the custom rolling metric:*

```
def rolling_metric(args):
    m_array = list()
    
    for i in range(test_length, step=step_size):
        prediction = model.predict(concat([context(i), actual(i)]))
        a = actual[:test_horizon]
        p = prediction[:test_horizon]
        m = MAE(a, p)
        m_array += [m]

    return np.mean(m_array)
```

Note that we extracted 20 testing households from the dataset. Testing a model means calculating the rolling metric for each of them. If we want to report on general model performance on the test set, we can do so by taking the average across all the tested households. (Indeed: the mean of means of mean absolute errors :no_mouth:)

<br>

## Some experiments

<br>

**1. Absolute vs cumulative - Personalized vs General model**

<br>

For some applications it is interesting to know when and how much energy will be consumed (absolute energy demand), while for others the most valuable information is the total amount of energy consumed in the coming future (cumulative energy demand). Both predictions have different objectives, thus different optimizations. We’ll prove this by training models for both objectives and comparing performance on the absolute energy demand signal.

<br>

Secondly, we investigate the difference between personalized models (one model for each household) and one generalized model. The personalized models take one separate model for each household of the test set, using a part of the total time series for training. A way more powerful model regarding deployment is the generalized model. Here, two years of energy consumption data of 300 households was used for training which is different from the test set.

<br>

*Summary: Mean of all household errors*

<br>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <table class="min-w-full bg-white text-center">
        <thead>
            <tr>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold"> </th>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold">Absolute energy</th>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold">Cumulative energy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">Personalized model (TFT)</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">38,243</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">87,979</td>
            </tr>
            <tr>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">General model (TFT)</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">34,529</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">49,749</td>
            </tr>
        </tbody>
    </table>
</div>


<br>
<br>

**2. ARIMA vs DeepAR vs TFT**

In the following experiment we compare the performance of 20 single model ARIMAs vs a general model trained using a DeepAR and temporal fusion transformer. The following models are trained to forecast absolute energy demand.

<br>

Because TFT and DeepAR didn’t receive any kind of hyperparameter optimization, ARIMA is trained on default settings (p, q, d) = (1, 1, 1). Just like the other models, ARIMA is given 7 days of context to predict the whole next day, after which the rolling metric is applied to evaluate performance.

<br>

*Summary: Mean of all household errors*

<br>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <table class="min-w-full bg-white text-center">
        <thead>
            <tr>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold"> </th>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold">ARIMA</th>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold">TFT</th>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold">DeepAR</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">Personalized model (TFT)</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">41,781</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">38,243</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">(not tested)</td>
            </tr>
            <tr>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">General model (TFT)</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">N.A.</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">34,529</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">34,708</td>
            </tr>
        </tbody>
    </table>
</div>

<br>
<br>

**3. Context & prediction length, multi-horizon optimization**

<br>

Up until now we’ve always fixed the context length to 7 days to predict a horizon of 1 day. The next experiment will show performance increase due to multi-horizon optimization. Again, since we want to evaluate general trends. The trained multi-horizon model was evaluated as is on the first try. Context length was considered from 1 day up to 7 days. Prediction horizon is trained for optimization between a 4 hours and 24 hours horizon.

<br>

*Summary: Mean of all household errors*

<br>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <table class="min-w-full bg-white text-center">
        <thead>
            <tr>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold"> </th>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold">Fixed context & horizon</th>
                <th class="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-black text-sm font-semibold">Multi-horizon Enabled</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">General model (TFT)</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">34,529</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-sm">30,153</td>
            </tr>
        </tbody>
    </table>
</div>


<br>
<br>

## The future of Time Series Forecasting

Energy demand forecasting is only the tip of the iceberg of the countless real world applications with a meaningful impact. We are seeing a lot of untapped potential in sectors like retail, healthcare and finance. Now that deep learning technology is proving to deliver a substantial increases in prediction performance, it will surely be a force to be reckoned with in the future.

<br>
<hr>
<br>

**Recognition:**

I was able to do the research for this article during the ML practice time at [In The Pocket](https://www.inthepocket.com/). At ITP we help businesses grow by implementing intelligent technologies while maintaining a perfect balance between responsability and personal development. Only one more thing to say: Better product, bigger futures.:rocket: 

<br>

**References:**

- *Hyndman, R.J., & Athanasopoulos, G. (2018) Forecasting: principles and practice, 2nd edition, OTexts: Melbourne, Australia. OTexts.com/fpp2. [Accessed on march 2021.]*

- *Amazon.com. (2012). DeepAR Forecasting Algorithm - Amazon SageMaker. [online] Available at: https://docs.aws.amazon.com/sagemaker/latest/dg/deepar.html.*

- *Lim, B., Arik, S.O., Loeff, N. and Pfister, T. (2020). Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting. arXiv:1912.09363 [cs, stat]. [online] Available at: https://arxiv.org/abs/1912.09363.*

- *pytorch-forecasting.readthedocs.io. (n.d.). PyTorch Forecasting Documentation — pytorch-forecasting documentation. [online] Available at: https://pytorch-forecasting.readthedocs.io/en/stable/ [Accessed March 2021].*

- *archive.ics.uci.edu. (n.d.). UCI Machine Learning Repository: ElectricityLoadDiagrams20112014 Data Set. [online] Available at: https://archive.ics.uci.edu/ml/datasets/ElectricityLoadDiagrams20112014 [Accessed March 2022].*

- *Kiprijanovska, I., Stankoski, S., Ilievski, I., Jovanovski, S., Gams, M. and Gjoreski, H. (2020). HousEEC: Day-Ahead Household Electrical Energy Consumption Forecasting Using Deep Learning. Energies, 13(10), p.2672. doi:10.3390/en13102672.*

<br>