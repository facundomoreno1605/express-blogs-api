const express = require('express');
const configs = require('./configs/configs');
const loader = require('./loaders');
const logger = require('./configs/logger');
const http = require('http');

const exitHandler = (server) => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server) => {
  return function (error) {
    logger.error(error);
    exitHandler(server);
  };
};

const startServer = async () => {
  const app = express();
  await loader(app);

  const httpServer = http.createServer(app);
  const server = httpServer.listen(configs.port, () => {
    logger.info(`server listening on port ${configs.port}`);
  });

  process.on('uncaughtException', unExpectedErrorHandler(server));
  process.on('unhandledRejection', unExpectedErrorHandler(server));
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

startServer();
