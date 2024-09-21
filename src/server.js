const express = require("express");
const passport = require("passport");

// @Routes
const BlogRoutes = require("./routes/blog.routes");
const AuthRoutes = require("./routes/auth.routes");

// @Middlewares
const {
  errorConverter,
  errorHandler,
} = require("./middlewares/error.middleware");
const nonExistingRoutesHandler = require("./middlewares/nonExistingRoutes.middleware");

//@Configs
const morgan = require("./configs/morgan");
const { jwtStrategy } = require("./configs/passport");

const app = express();

// @Logger
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(express.json());

// @Passport
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// @Routes
app.use("/api", BlogRoutes);
app.use("/api", AuthRoutes);

// @Middlewares
app.use(nonExistingRoutesHandler);

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
