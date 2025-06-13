// middleware/auth.js
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');

exports.authenticate = (req, res, next) => {
  console.log('Request Headers:', req.headers);

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
    //Penerapan Clean-Code: Runtime Configuration
      const AuthConfig = {
        get secret() { return process.env.JWT_SECRET || 'default_secret'; },
        get expiresIn() { return process.env.JWT_EXPIRES_IN || '1h'; }
    };

        const decoded = jwt.verify(token, AuthConfig.secret);
      console.log('Token verified:', decoded);
      req.user = decoded;
      next();
  } catch (err) {
      console.log('Invalid token:', err);
      return res.status(401).json({ message: 'Invalid token' });
  }
};
