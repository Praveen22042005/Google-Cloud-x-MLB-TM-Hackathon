const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route   GET /api/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password') // Exclude password
      .populate('following', 'username')
      .populate('followers', 'username')
      .populate('collections.highlights'); // Adjust based on your schema

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/users/me/preferences
 * @desc    Get current user's preferences
 * @access  Private
 */
router.get('/me/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/me/preferences
 * @desc    Update current user's preferences
 * @access  Private
 */
router.put('/me/preferences', auth, async (req, res) => {
  try {
    const { teams, players, language, notificationFrequency, highlightTypes } = req.body;

    // Optional: Add validation for the incoming data
    // Example:
    // if (!availableTeams.includes(team)) { /* handle error */ }

    const updatedPreferences = {
      teams,
      players,
      language,
      notificationFrequency,
      highlightTypes
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: updatedPreferences },
      { new: true, runValidators: true }
    ).select('preferences');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Update current user's profile (email, username)
 * @access  Private
 */
router.put('/me', auth, async (req, res) => {
  try {
    const { email, username } = req.body;

    // Validate input (optional)
    if (!email || !username) {
      return res.status(400).json({ error: 'Email and username are required' });
    }

    // Check if the new email or username is already taken by another user
    const emailExists = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (emailExists) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const usernameExists = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (usernameExists) {
      return res.status(400).json({ error: 'Username is already in use' });
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { email, username },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/users/me
 * @desc    Delete current user's account
 * @access  Private
 */
router.delete('/me', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add more user-related routes as needed (e.g., follow/unfollow, collections, etc.)

module.exports = router;