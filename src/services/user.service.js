const { UserModel } = require('../models');
const ApiError = require('../utils/ApiError.util');
const httpStatus = require('http-status');
const EventEmitter = require('../utils/EventEmitter.util');

const createUser = async ({ name, email, password }) => {
  if (await UserModel.isEmailTaken(email)) {
    throw new ApiError({
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Email is already taken',
    });
  }

  const user = await UserModel.create({ name, email, password });

  EventEmitter.emit('signup', user);

  return user;
};

const getUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

const getUserById = async (id) => {
  return await UserModel.findOne({ _id: id });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
