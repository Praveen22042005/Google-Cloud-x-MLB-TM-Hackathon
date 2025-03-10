const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
    try {
      console.log('JWT_SECRET:', JWT_SECRET);
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'No token provided' });
  
      console.log('Received Token:', token);
  
      // Specify the algorithm explicitly
      const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).json({ error: 'Invalid token' });
  
      req.user = user;
      next();
    } catch(error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  };

module.exports = auth;