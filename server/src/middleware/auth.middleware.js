/**
 * Authentication Middleware
 * JWT token verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization.model');
const Teacher = require('../models/Teacher.model');
const Student = require('../models/Student.model');

/**
 * Protect routes - verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user based on role
    let user;
    switch (decoded.role) {
      case 'organization':
        user = await Organization.findById(decoded.id);
        break;
      case 'teacher':
        user = await Teacher.findById(decoded.id);
        break;
      case 'student':
        user = await Student.findById(decoded.id);
        break;
      default:
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Grant access to protected route
    req.user = {
      id: user._id,
      role: decoded.role,
      data: user
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error verifying token',
      error: error.message
    });
  }
};

/**
 * Restrict to specific roles
 * Usage: restrictTo('organization', 'teacher')
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

/**
 * Verify email is verified (optional middleware)
 */
exports.requireEmailVerification = (req, res, next) => {
  if (!req.user.data.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email before accessing this resource'
    });
  }
  next();
};