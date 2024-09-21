const { envValidations } = require("../validations");
require("dotenv").config();

const { value: envVars, error } = envValidations.validate(process.env);

if (error) {
  console.error(error);
}

module.exports = {
  port: envVars.PORT,
  dbConnectionUri: envVars.DB_CONNECTION_URI,
  env: envVars.NODE_ENV,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
};
