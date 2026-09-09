const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── @route   POST /api/auth/register ────────────────
// ── @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check if all fields provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // create user (password gets hashed by pre-save hook in model)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token:   generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   POST /api/auth/login ───────────────────
// ── @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      token:   generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   GET /api/auth/me ────────────────────────
// ── @access  Private (requires token)
const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   PUT /api/auth/profile ──────────────────
// ── @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.name  = req.body.name  || user.name;
    user.email = req.body.email || user.email;

    // only update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      user: {
        _id:   updatedUser._id,
        name:  updatedUser.name,
        email: updatedUser.email,
        role:  updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };