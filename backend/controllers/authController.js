import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  console.log('--- New Login Attempt ---');
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('[DEBUG] Login failed: Email or password missing from request body.');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log(`[DEBUG] Searching for user with email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[DEBUG] Login failed: User with email ${email} not found in database.`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`[DEBUG] User found: ${user.name}. Comparing passwords...`);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log(`[DEBUG] Password match for user ${email}. Sending token.`);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log(`[DEBUG] Login failed: Password mismatch for user ${email}.`);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('[CRITICAL] An unexpected error occurred in loginUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser, getUserProfile };
