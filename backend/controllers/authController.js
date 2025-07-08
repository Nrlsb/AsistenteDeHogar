import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

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
      const payload = {
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      };
      console.log('[SUCCESS] Registering user and sending payload:', payload);
      res.status(201).json(payload);
    } else {
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email or password missing in request' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create the data payload to be sent to the frontend
      const payload = {
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      };

      // Log exactly what we are about to send
      console.log('[SUCCESS] User authenticated. Sending payload:', payload);

      // Explicitly set status to 200 and send the JSON payload
      res.status(200).json(payload);

    } else {
      console.log(`[FAILURE] Invalid credentials for email: ${email}`);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser, getUserProfile };
