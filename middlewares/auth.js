const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized_error');
const { UNAUTH } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(UNAUTH);
  }

  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'my-secret');
  } catch (err) {
    throw new UnauthorizedError(UNAUTH);
  }

  req.user = payload;

  next();
};

module.exports = auth;
