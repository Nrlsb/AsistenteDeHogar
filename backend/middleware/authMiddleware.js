import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Middleware to protect routes that require authentication.
 * Verifies the JWT token from the Authorization header.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for the authorization header and ensure it's a Bearer token
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>" string
      token = authHeader.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID encoded in the token
      // Attach the user object to the request, excluding the password
      req.user = await User.findById(decoded.id).select('-password');

      // If no user is found with this ID, the token is invalid
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // If token is valid and user is found, proceed to the next middleware
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token or incorrect scheme is provided in the header
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
