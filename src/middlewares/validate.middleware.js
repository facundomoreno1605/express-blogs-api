const joi = require("joi");
const ApiErrorUtil = require("../utils/ApiError.util");
const httpStatus = require("http-status");

const validateSchema = (schema) => (req, res, next) => {
  const keys = Object.keys(schema);

  const object = keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      obj[key] = req[key];
    }
    return obj;
  }, {});

  const { error } = joi.compile(schema).validate(object, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message).join(",");
    next(
      new ApiErrorUtil({ statusCode: httpStatus.BAD_REQUEST, message: errors })
    );
  }

  return next();
};

module.exports = validateSchema;
