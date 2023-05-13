<a name="top"></a>
<p align="center">
  <img title="JavaScript" src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_100,w_200/v1683961930/parental_advisory_nerd.webp"/>
  <br>
  <br>
  <img src="https://cdn.discordapp.com/attachments/989268410171006976/1106407362664878223/drodriguez_vector_logo_for_app_paint_a_gym_bar_and_the_name_AIL_8504ee67-6267-4930-b791-2f9dc1b6c11f.png" width="400" alt="AILift" />
  <br>
  <span>** This image was generated with <a target="_blank" href="https://www.midjourney.com">Midjourney</a> AI **</span>
</p>

# INDEX

* [¿WHAT IS AI-LIFT?](#what-is)
* [REQUIREMENTS](#requirements)
* [STEPS TO DOWNLOAD, CONFIGURE AND USE THE APPLICATION](#main-steps)
  * [Download](#download)
  * [Install dependencies](#install-dependencies)
  * [Configure environment variables](#configure-env)
  * [Start application in your local machine](#start-app)
  * [Test application](#test-app)
* [TENSORFLOW IMPLEMENTATION](#tensorflow)
* [TECHNOLOGIES THAT I USED](#technologies)
* [CONTRIBUTIONS](#contributions)
* [LICENSE](#license)

<a name="what-is"></a>

# ¿WHAT IS AI-LIFT?

This API provides services for a technology platform related to sports, specifically functional training and Olympic lifting. It is designed for athletes of any level and integrates artificial intelligence into its functionalities.

<a name="requirements"></a>

# REQUIREMENTS

- [Git](https://gitforwindows.org/) installed in your machine.
- [npm](https://nodejs.org/es/download/) installed and configured in your machine.
- [node](https://nodejs.org/es/download/) installed and configured in your machine.
- Text editor like [VS Code](https://code.visualstudio.com/).


<a name="main-steps"></a>

# STEPS TO DOWNLOAD, CONFIGURE AND USE THE APPLICATION

<p align="center">
  <img src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_260,w_360/v1651348337/Landing/service-image.webp" alt="Download and configure">
</p>

<a name="download"></a>

## > Download

You can download the application by copying its link, either by ssh or https. The git command you need to run is as follows:

```sh
# HTTPS =====================================================!

# Clone repository
$ git clone https://github.com/dancrewzus/ai-fit.git
$ cd fx11_api

# If you want to download it with another folder name, example your-folder-name
$ git clone https://github.com/dancrewzus/ai-fit.git your-folder-name
$ cd your-folder-name

# SSH =======================================================!

# Clone repository
$ git clone git@github.com:dancrewzus/ai-fit.git
$ cd fx11_api

# If you want to download it with another folder name, example your-folder-name
$ git clone git@github.com:dancrewzus/ai-fit.git your-folder-name
$ cd your-folder-name
```

<a name="install-dependencies"></a>

## > Install dependencies

In the application root folder, type this command in the command line terminal:

```sh
# Install dependencies with npm
$ npm install

# Install dependencies with Yarn
$ yarn install
```


<a name="configure-env"></a>

## > Configure environment variables

The app uses some environment variables to get its important data like API keys or any other information. These variables must be created directly on your computer and you must assign values ​​to the data that appears below:

```sh
# MONGODB
MONGO_DB_USER=""
MONGO_DB_PASSWORD=""
MONGO_DB_CLUSTER=""
MONGO_DB_NAME=""
CONNECTION_STRING=""
# GENERAL
DEFAULT_LIMIT=10
PORT=3000
```


<a name="start-app"></a>

## > Start application in your local machine

To start the applicatioN, we must execute the following command:

```sh
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

> If you want to stop the execution press (ctrl + c) / (cmd + c) in the command line terminal.


<a name="test-app"></a>

## > Test application

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


<a name="tensorflow"></a>

# TENSORFLOW IMPLEMENTATION

The code is divided into several parts:

- **Library Import and Training Data:** The Tensorflow.js library is imported and the training data is defined. The training data consists of three data sets: repetitions, sets, and weights, which are used to train the model.

- **Data Preprocessing:** The training data is converted into tensors, which is the data format that TensorFlow.js uses for training models. Also, the data is normalized (i.e., resized to a scale from 0 to 1) to aid model convergence during training.

- **Model Creation:** A sequential model is created, which is a type of model in TensorFlow.js that allows stacking neuron layers one after another. In this case, two hidden layers are created with 64 neurons each, using the 'ReLU' activation function. The final layer is the output layer, which has a single neuron with a linear activation function, as this is a regression problem.

- **Model Compilation:** The model is compiled with a mean squared error loss function (which is common in regression problems) and an Adam optimizer (a type of optimization algorithm).

- **Model Training:** The model is trained using the input data (repetitions and sets) and the output data (weights). The model is trained for a set number of epochs (passes through the training data).

- **Prediction:** Once the model is trained, it can be used to predict the weight based on a new combination of repetitions and sets. The output is denormalized (resized back to the original scale of the data) to provide a readable weight prediction.

<br>


<a name="technologies"></a>

# TECHNOLOGIES THAT I USED

This is the list of technologies that i use in the development of this api.
<br>
<br>
<p align="center">
  <a target="_blank" href="https://www.javascript.com">
    <img title="JavaScript" src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_60,w_60/v1600633849/Landing/javascript.webp"/>
  </a>&nbsp; &nbsp;
  <a target="_blank" href="https://www.typescriptlang.org/">
    <img title="TypeScript" src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_60,w_60/v1600633849/Landing/typescript.png"/>
  </a>&nbsp; &nbsp;
  <a target="_blank" href="https://nodejs.org/en">
    <img title="NodeJS" src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_60,w_160/v1600633849/Landing/nodejs.webp"/>
  </a>&nbsp; &nbsp;
  <a target="_blank" href="https://expressjs.com">
    <img title="ExpressJS" src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_60,w_160/v1651344178/Landing/express.webp"/>
  </a><br><br>
  <a target="_blank" href="https://nestjs.com">
    <img title="NestJS" src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_60,w_160/v1600633848/Landing/nest.webp"/>
  </a>&nbsp; &nbsp;
  <a target="_blank" href="https://www.tensorflow.org">
    <img title="Tensorflow" src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_60,w_160/v1600633849/Landing/tensorflow.png"/>
  </a>&nbsp; &nbsp;
</p>


<a name="contributions"></a>

# CONTRIBUTIONS

Contributions are welcome. Please create an issue to discuss your ideas before submitting a Pull Request.


<a name="license"></a>

# LICENSE

This project is licensed under the [MIT licensed](LICENSE).

