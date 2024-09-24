const catchAsync = require('./../utils/catchAsync.util');
const httpStatus = require('http-status');
const { UserService, TokenService, AuthService } = require('./../services');

const register = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);

  const token = await TokenService.generateAuthTokens(user.id);

  return res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await AuthService.login({
    email,
    password,
    ipAddr: req.connection.remoteAddress,
  });
  const token = await TokenService.generateAuthTokens(user.id);

  return res.status(httpStatus.OK).send({ user, token });
});

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await AuthService.refreshAuthToken(req.body.refreshToken);

  return res.status(httpStatus.OK).send({ ...tokens });
});

module.exports = {
  register,
  login,
  refreshToken,
};
