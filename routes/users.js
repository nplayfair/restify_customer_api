const errors  = require('restify-errors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const dotenv    = require('dotenv');
const User    = require('../models/User');
const auth    = require('../auth');

dotenv.config();

module.exports = server => {
  // Register user
  server.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash password
        user.password = hash;
        // Save user
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch(err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // Authenticate user
  server.post('/auth', async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // Authenticate user
      const user = await auth.authenticate(email, password);
      
      // Create JWT
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '15m'
      });
      const { iat, exp } = jwt.decode(token);

      // Respond with token
      res.send({ iat, exp, token });

      next();
    } catch(err) {
      // User unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });
}