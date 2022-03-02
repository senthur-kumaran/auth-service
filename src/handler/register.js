const bcrypt = require('bcryptjs-then');
const { connectToDatabase } = require('../config/db');
const User = require('../models/User');
const { signToken } = require('../utils/helpers');

const checkIfInputIsValid = (eventBody) => {
  if (
    !(eventBody.password
      && eventBody.password.length >= 7)
  ) {
    throw new Error('Password error. Password needs to be longer than 8 characters.');
  }

  if (
    !(eventBody.name
      && eventBody.name.length > 5
      && typeof eventBody.name === 'string')
  ) throw new Error('Username error. Username needs to longer than 5 characters');

  if (
    !(eventBody.email
      && typeof eventBody.name === 'string')
  ) throw new Error('Email error. Email must have valid characters.');
};

const register = async (eventBody) => {
  checkIfInputIsValid(eventBody);
  const user = await User.findOne({ email: eventBody.email });
  if (user) {
    throw new Error('User with that email exists.');
  }
  const hash = await bcrypt.hash(eventBody.password, 8);
  const newUser = await User.create({
    name: eventBody.name,
    email: eventBody.email,
    password: hash,
  });
  // eslint-disable-next-line no-underscore-dangle
  return { auth: true, token: signToken(newUser._id) };
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const session = await register(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(session),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
