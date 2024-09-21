const joi = require("joi");

const envVarsSchema = joi
  .object({
    DB_CONNECTION_URI: joi.string().required(),
    PORT: joi.number().positive().default(3000),
    NODE_ENV: joi
      .string()
      .valid("development", "production", "test")
      .default("development"),
  })
  .unknown(true);

module.exports = envVarsSchema;
