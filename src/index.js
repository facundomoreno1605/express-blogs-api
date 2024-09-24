const mongoose = require('mongoose');
const configs = require('./configs/configs');
const app = require('./server');
const http = require('http');
const logger = require('./configs/logger');

mongoose
  .connect(configs.dbConnectionUri)
  .then(() => {
    logger.info('Connected to the database');
  })
  .catch((error) => {
    logger.error('Cannot connect to the database', error);
    process.exit();
  });

const port = configs.port;
const httpServer = http.createServer(app);
const server = httpServer.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unExpectedErrorHandler);
process.on('unhandledRejection', unExpectedErrorHandler);
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  exitHandler();
});
