const UserService = require("./user.service");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError.util");
const TokenService = require("./token.service");
const { tokenTypes } = require("../configs/tokens");
const { RateLimiterMongo } = require("rate-limiter-flexible");
const mongoose = require("mongoose");
const configs = require("../configs/configs");
const logger = require("../configs/logger");

const login = async ({ email, password, ipAddr }) => {
  const rateLimiterOptions = {
    storeClient: mongoose.connection,
    blockDuration: 60 * 60 * 24,
    dbName: "blog-api",
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

  const promises = [slowerBruteLimiter.consume(ipAddr)];

  const user = await UserService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    user &&
      promises.push([
        emailIpBruteLimiter.consume(`${email}_${ipAddr}`),
        emailBruteLimiter.consume(email),
      ]);
    await Promise.all(promises);

    throw new ApiError({
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Incorrect email or password",
    });
  }

  return user;
};

const refreshAuthToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await TokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );

    const user = await UserService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }

    await refreshTokenDoc.deleteOne();

    return TokenService.generateAuthTokens(user.id);
  } catch (error) {
    logger.error(error);

    throw new ApiError({
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Need authentication",
    });
  }
};

module.exports = {
  login,
  refreshAuthToken,
};
