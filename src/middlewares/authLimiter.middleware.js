const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError.util');
const configs = require('../configs/configs');

const rateLimiterOptions = {
  storeClient: mongoose.connection,
  blockDuration: 60 * 60 * 24,
  dbName: 'blog-api',
};

const emailIpBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: configs.rateLimiter.maxAttemptsByIpUsername,
  duration: 60 * 10,
});

const slowerBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: configs.rateLimiter.maxAttemptsPerDay,
  duration: 60 * 60 * 24,
});

const emailBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: configs.rateLimiter.maxAttemptsPerEmail,
  duration: 60 * 60 * 24,
});

const authLimiterMiddleware = async (req, res, next) => {
  const ipAddr = req.connection.remoteAddress;
  const email = req.body.email;
  const emailIpKey = `${email}_${ipAddr}`;

  const [slowerBruteRes, emailIpRes, emailRes] = await Promise.all([
    slowerBruteLimiter.get(ipAddr),
    emailIpBruteLimiter.get(emailIpKey),
    emailBruteLimiter.get(email),
  ]);

  let retrySeconds = 0;
  if (
    slowerBruteRes &&
    slowerBruteRes.consumedPoints >= configs.rateLimiter.maxAttemptsPerDay
  ) {
    retrySeconds = Math.floor(slowerBruteRes.msBeforeNext / 1000) || 1;
  } else if (
    emailIpRes &&
    emailIpRes.consumedPoints >= configs.rateLimiter.maxAttemptsByIpUsername
  ) {
    retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
  } else if (
    emailRes &&
    emailRes.consumedPoints >= configs.rateLimiter.maxAttemptsPerEmail
  ) {
    retrySeconds = Math.floor(emailRes.msBeforeNext / 1000) || 1;
  }

  if (retrySeconds > 0) {
    res.set('Retry-After', String(retrySeconds));

    return next(
      new ApiError({
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests',
      }),
    );
  }
  next();
};

module.exports = {
  emailIpBruteLimiter,
  slowerBruteLimiter,
  emailBruteLimiter,
  authLimiterMiddleware,
};
