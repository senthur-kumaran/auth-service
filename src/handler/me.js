const { connectToDatabase } = require('../config/db');
const User = require('../models/User');

const me = async (userId) => {
  const user = await User.findById(userId, { password: 0 });
  if (!user) {
    throw new Error('No user found.');
  }
  return user;
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const session = await me(event.requestContext.authorizer.principalId);
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
