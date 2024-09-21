const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const configs = require("./configs");
const { tokenTypes } = require("./tokens");
const { UserService } = require("../services");

const jwtOptions = {
  secretOrKey: configs.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type != tokenTypes.ACCESS) {
      throw new Error("Invalid token");
    }

    const user = UserService.getUserById(payload.sub);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
