const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const logger = require('../configs/logger');

module.exports = async (app) => {
  await mongooseLoader();
  logger.info('Mongoose initiated.');

  await expressLoader(app);
  logger.info('Express app initiated.');
};
