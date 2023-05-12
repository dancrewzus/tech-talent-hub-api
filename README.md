<p align="center">
  <img src="https://cdn.discordapp.com/attachments/989268410171006976/1106407362664878223/drodriguez_vector_logo_for_app_paint_a_gym_bar_and_the_name_AIL_8504ee67-6267-4930-b791-2f9dc1b6c11f.png" width="200" alt="AILift" />
</p>

# ¿WHAT IS AI-LIFT?

This API provides services for a technology platform related to sports, specifically functional training and Olympic lifting. It is designed for athletes of any level and integrates artificial intelligence into its functionalities.


# REQUIREMENTS

- [Git](https://gitforwindows.org/) installed in your machine.
- [npm](https://nodejs.org/es/download/) installed and configured in your machine.
- [node](https://nodejs.org/es/download/) installed and configured in your machine.
- Text editor like [VS Code](https://code.visualstudio.com/).

# STEPS TO DOWNLOAD, CONFIGURE AND USE THE APPLICATION

<p align="center">
  <img src="https://res.cloudinary.com/idepixel/image/upload/c_scale,h_260,w_360/v1651348337/Landing/service-image.webp" alt="Download and configure">
</p>

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
## > Install dependencies

In the application root folder, type this command in the command line terminal:

```sh
# Install dependencies with npm
$ npm install

# Install dependencies with Yarn
$ yarn install
```
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

## > Test application

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

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

## Contributions

Contributions are welcome. Please create an issue to discuss your ideas before submitting a Pull Request.

## License

This project is licensed under the [MIT licensed](LICENSE).
