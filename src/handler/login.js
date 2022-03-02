const bcrypt = require('bcryptjs-then');
const { connectToDatabase } = require('../config/db');
const User = require('../models/User');
const { signToken } = require('../utils/helpers');

const comparePassword = async (eventPassword, userPassword, userId) => {
  const passwordIsValid = await bcrypt.compare(eventPassword, userPassword);
  if (!passwordIsValid) {
    throw new Error('The credentials do not match.');
  }
  return signToken(userId);
};

const login = async (eventBody) => {
  const user = await User.findOne({ email: eventBody.email });
  if (!user) {
    throw new Error('User with that email does not exits.');
  }
  // eslint-disable-next-line no-underscore-dangle
  const token = await comparePassword(eventBody.password, user.password, user._id);
  return { auth: true, token };
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const session = await login(JSON.parse(event.body));
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
