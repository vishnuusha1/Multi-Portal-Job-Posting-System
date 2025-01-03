const passport = require('../../../middlewares/passport.guard');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const logger = require('../../../shared/logger');
const Responder = require('../../../shared/responder');
dotenv.config();

const login = (req, res, next) => {
  const responder = new Responder(req, res);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
       logger.error(err.message);  
       responder.crash();         
    }

    if (!user) {
      return responder.error(info.message || 'Authentication failed');
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ message: 'Login successful', token });
  })(req, res, next);
};

module.exports = {
  login,
};
