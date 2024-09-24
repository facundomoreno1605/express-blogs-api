const httpStatus = require('http-status');
const ApiErrorUtil = require('../utils/ApiError.util');

const nonExistingRoutesHandler = (req, res, next) => {
  next(
    new ApiErrorUtil({
      statusCode: httpStatus.NOT_FOUND,
      message: 'Route not found',
    }),
  );
};

module.exports = nonExistingRoutesHandler;
