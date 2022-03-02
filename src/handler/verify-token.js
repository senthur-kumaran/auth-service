const jwt = require('jsonwebtoken');

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.handler = async (event) => {
  const token = event.authorizationToken;

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return generatePolicy(decoded.id, 'Allow', event.methodArn);
  } catch (error) {
    throw new Error('Unauthorized');
  }
};
