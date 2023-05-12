import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  OPENAI_API_KEY: Joi.required(),
  OPENAI_ORG_KEY: Joi.required(),
  MONGO_DB_USER: Joi.required(),
  MONGO_DB_PASSWORD: Joi.required(),
  MONGO_DB_CLUSTER: Joi.required(),
  MONGO_DB_NAME: Joi.required(),
  DEFAULT_LIMIT: Joi.number().default(10),
  PORT: Joi.number().default(3003)
})