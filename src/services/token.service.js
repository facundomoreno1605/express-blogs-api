const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const configs = require('./../configs/configs');
const { tokenTypes } = require('./../configs/tokens');
const { TokenModel } = require('./../models');

const generateToken = ({
  userId,
  expires,
  type,
  secret = configs.jwt.secret,
}) => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    type,
  };

  return jwt.sign(payload, secret);
};

const saveToken = async ({
  token,
  userId,
  expires,
  type,
  blacklisted = false,
}) => {
  const tokenDoc = await TokenModel.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });

  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, configs.jwt.secret);

  const tokenDoc = await TokenModel.findOne({
    token,
    user: payload.sub,
    type,
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new Error('Token not found');
  }

  return tokenDoc;
};

const generateAuthTokens = async (userId) => {
  const accessTokenExpires = dayjs().add(
    configs.jwt.accessExpirationMinutes,
    'minutes',
  );
  const accessToken = generateToken({
    userId,
    expires: accessTokenExpires,
    type: tokenTypes.ACCESS,
  });

  const refreshTokenExpires = dayjs().add(
    configs.jwt.refreshExpirationDays,
    'days',
  );
  const refreshToken = generateToken({
    userId,
    expires: refreshTokenExpires,
    type: tokenTypes.REFRESH,
  });

  await saveToken({
    token: refreshToken,
    userId,
    expires: refreshTokenExpires,
    type: tokenTypes.REFRESH,
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
  saveToken,
  verifyToken,
};
