const express = require('express');
const passport = require('passport');

// @Routes
const BlogRoutes = require('./routes/blog.routes');
const AuthRoutes = require('./routes/auth.routes');

// @Middlewares
const {
  errorConverter,
  errorHandler,
} = require('./middlewares/error.middleware');
const nonExistingRoutesHandler = require('./middlewares/nonExistingRoutes.middleware');
const { xss } = require('express-xss-sanitizer');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

//@Configs
const morgan = require('./configs/morgan');
const { jwtStrategy } = require('./configs/passport');
const configs = require('./configs/configs');

const app = express();

// @Logger
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(express.json());

// @Passport
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// @Security
app.use(xss());
app.use(helmet({ contentSecurityPolicy: configs.cspOptions }));
app.use(mongoSanitize());

if (configs.env === 'production') {
  app.use(cors({ origin: 'url' }));
  app.options('*', cors({ origin: 'url' }));
} else {
  app.use(cors());
  app.options('*', cors());
}

// @Routes
app.use('/api', BlogRoutes);
app.use('/api', AuthRoutes);

// @Middlewares
app.use(nonExistingRoutesHandler);

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
