const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Responder = require('../shared/responder');
dotenv.config();

/**
 * Middleware that checks for the presence of a valid Bearer token in the Authorization header.
 * If the token is invalid, missing or expired, the request is rejected with a 401 status code.
 *
 * @param {Object} req - The Express.js request object
 * @param {Object} res - The Express.js response object
 * @param {Function} next - The next middleware in the chain
 */
const authGuard = (req, res, next) => {
  const responder = new Responder(req, res);
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return responder.unauthorized('Authorization token missing');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return responder.tokenExpired('Invalid or expired token');
  }
};

module.exports = authGuard;
