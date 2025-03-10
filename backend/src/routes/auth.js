const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this matches your .env key

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userExists = await User.findOne({ email });
    if(userExists) return res.status(400).json({ error: 'User already exists' });

    const user = new User({ email, username, password });
    await user.save();

    console.log('Signing Token with JWT_SECRET:', JWT_SECRET); // Added log
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch(error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    console.log('Signing Token with JWT_SECRET:', JWT_SECRET); // Added log
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch(error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;