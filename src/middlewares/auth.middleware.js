const ApiError = require('./../utils/ApiError.util');
const httpStatus = require('http-status');
const passport = require('passport');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(
      new ApiError({
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Need authentication',
      }),
    );
  }

  req.user = user;

  return resolve();
};

const authMiddleware = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject),
    )(req, res, next);
  })
    .then(() => next())
    .catch((error) => next(error));
};

module.exports = authMiddleware;
