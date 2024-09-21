const UserService = require("./user.service");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError.util");
const TokenService = require("./token.service");
const { tokenTypes } = require("../configs/tokens");

const login = async ({ email, password }) => {
  const user = await UserService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
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
