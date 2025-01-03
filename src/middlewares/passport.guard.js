const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config(); 

passport.use(
  new LocalStrategy((username, password, done) => {
    const storedUsername = process.env.USER_USERNAME;
    const storedPassword = process.env.HASHED_PASSWORD;

    if (username !== storedUsername) {
      return done(null, false, { message: 'Invalid username' });
    }
    bcrypt.compare(password, storedPassword, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, { username: storedUsername });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  done(null, { username });
});

module.exports = passport;
