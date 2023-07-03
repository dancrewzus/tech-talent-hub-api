import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_DB_USER: Joi.required(),
  MONGO_DB_PASSWORD: Joi.required(),
  MONGO_DB_CLUSTER: Joi.required(),
  MONGO_DB_NAME: Joi.required(),
  JWT_SECRET: Joi.required(),
  JWT_EXPIRES_IN: Joi.required(),
  DEFAULT_LIMIT: Joi.number().default(10),
  PORT: Joi.number().default(3000)
})