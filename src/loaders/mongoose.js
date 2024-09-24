const mongoose = require('mongoose');
const config = require('../configs/configs');

module.exports = async () => {
  const connection = await mongoose.connect(config.dbConnectionUri);
  return connection;
};
