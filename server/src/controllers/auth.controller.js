/**
 * Authentication Controller
 * Handles registration, login, and email verification for all user types
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Organization = require('../models/Organization.model');
const Teacher = require('../models/Teacher.model');
const Student = require('../models/Student.model');

// Generate JWT Token
const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Send token response
const createSendToken = (user, statusCode, res, role) => {
  const token = signToken(user._id, role);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
      role
    }
  });
};


/**
 * Register Organization/School
 * POST /api/auth/organization/register
 */
exports.registerOrganization = async (req, res) => {
  try {
    console.log('📥 Register organization request from origin:', req.headers.origin);
    console.log('📦 Payload:', req.body);
    const { organizationName, email, password, state, city, district, pincode } = req.body;

    // Validation
    if (!organizationName || !email || !password || !state || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: organization name, email, password, state, and city'
      });
    }

    // Check if organization already exists
    const existingOrg = await Organization.findOne({ 
      $or: [{ email }, { organizationName }] 
    });

    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'Organization with this email or name already exists'
      });
    }

    // Auto-geocode location (get latitude/longitude from city/state)
    const { normalizeLocation } = require('../services/geocoding.service');
    const locationData = normalizeLocation({ state, city, pincode });

    // Create organization with location data including coordinates
    const organization = await Organization.create({
      organizationName,
      email,
      password,
      location: { 
        state: locationData.state, 
        city: locationData.city,
        district: district || undefined,
        pincode: locationData.pincode,
        latitude: locationData.latitude,
        longitude: locationData.longitude
      },
      ...req.body
    });

    // Generate verification token
    const verificationToken = organization.createVerificationToken();
    await organization.save({ validateBeforeSave: false });

    // TODO: Send verification email
    // await sendVerificationEmail(email, verificationToken);

    createSendToken(organization, 201, res, 'organization');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering organization',
      error: error.message
    });
  }
};

/**
 * Login Organization/School
 * POST /api/auth/organization/login
 */
exports.loginOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Find organization
    const organization = await Organization.findOne({ email }).select('+password');

    if (!organization) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!organization.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated'
      });
    }

    // If password is provided, verify it
    if (password) {
      const isPasswordCorrect = await organization.comparePassword(password);
      
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }

    // Update last login
    organization.lastLogin = Date.now();
    await organization.save({ validateBeforeSave: false });

    createSendToken(organization, 200, res, 'organization');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};


/**
 * Register Teacher
 * POST /api/auth/teacher/register
 */
exports.registerTeacher = async (req, res) => {
  try {
    const { 
      organizationName, 
      name, 
      email, 
      password, 
      subject, 
      grade, 
      section 
    } = req.body;

    // Validation
    if (!organizationName || !name || !email || !password || !subject || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Find organization
    const organization = await Organization.findOne({ organizationName });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found. Please check the organization name.'
      });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }

    // Get location data if provided
    let locationData = {};
    if (req.body.city || req.body.state) {
      const { normalizeLocation, getCoordinates } = require('../services/geocoding.service');
      try {
        if (req.body.city && req.body.state) {
          locationData = normalizeLocation({ 
            state: req.body.state, 
            city: req.body.city, 
            pincode: req.body.pincode 
          });
        } else if (organization.location) {
          // Use organization's location as fallback
          locationData = {
            city: organization.location.city,
            latitude: organization.location.latitude,
            longitude: organization.location.longitude
          };
        }
      } catch (error) {
        console.warn('Geocoding error for teacher:', error.message);
      }
    } else if (organization.location) {
      // Use organization's location as fallback
      locationData = {
        city: organization.location.city,
        latitude: organization.location.latitude,
        longitude: organization.location.longitude
      };
    }

    // Create teacher
    const teacher = await Teacher.create({
      organization: organization._id,
      name,
      email,
      password,
      subject,
      classTeacher: {
        grade,
        section: section || 'A'
      },
      city: locationData.city || req.body.city,
      latitude: locationData.latitude || req.body.latitude,
      longitude: locationData.longitude || req.body.longitude,
      ...req.body
    });

    // Update organization teacher count
    organization.totalTeachers += 1;
    await organization.save({ validateBeforeSave: false });

    // Generate verification token
    const verificationToken = teacher.createVerificationToken();
    await teacher.save({ validateBeforeSave: false });

    createSendToken(teacher, 201, res, 'teacher');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering teacher',
      error: error.message
    });
  }
};

/**
 * Login Teacher
 * POST /api/auth/teacher/login
 */
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Find teacher
    const teacher = await Teacher.findOne({ email })
      .select('+password')
      .populate('organization', 'organizationName location');

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!teacher.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated'
      });
    }

    // If password is provided, verify it
    if (password) {
      const isPasswordCorrect = await teacher.comparePassword(password);
      
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }

    // Update last login
    teacher.lastLogin = Date.now();
    await teacher.save({ validateBeforeSave: false });

    createSendToken(teacher, 200, res, 'teacher');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * Register Student
 * POST /api/auth/student/register
 */
exports.registerStudent = async (req, res) => {
  try {
    const { 
      organizationName, 
      name, 
      email, 
      password, 
      grade, 
      section, 
      rollNumber 
    } = req.body;

    // Validation
    if (!organizationName || !name || !email || !password || !grade || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Find organization
    const organization = await Organization.findOne({ organizationName });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found. Please check the organization name.'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [
        { email },
        { organization: organization._id, 'class.grade': grade, 'class.section': section || 'A', rollNumber }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or roll number already exists in this class'
      });
    }

    // Find class teacher
    const classTeacher = await Teacher.findOne({
      organization: organization._id,
      'classTeacher.grade': grade,
      'classTeacher.section': section || 'A'
    });

    // Get location data if provided
    let locationData = {};
    if (req.body.city || req.body.state) {
      const { normalizeLocation } = require('../services/geocoding.service');
      try {
        if (req.body.city && req.body.state) {
          locationData = normalizeLocation({ 
            state: req.body.state, 
            city: req.body.city, 
            pincode: req.body.pincode 
          });
        } else if (organization.location) {
          // Use organization's location as fallback
          locationData = {
            city: organization.location.city,
            latitude: organization.location.latitude,
            longitude: organization.location.longitude
          };
        }
      } catch (error) {
        console.warn('Geocoding error for student:', error.message);
      }
    } else if (organization.location) {
      // Use organization's location as fallback
      locationData = {
        city: organization.location.city,
        latitude: organization.location.latitude,
        longitude: organization.location.longitude
      };
    }

    // Create student
    const student = await Student.create({
      organization: organization._id,
      classTeacher: classTeacher?._id,
      name,
      email,
      password,
      class: {
        grade,
        section: section || 'A'
      },
      rollNumber,
      city: locationData.city || req.body.city,
      latitude: locationData.latitude || req.body.latitude,
      longitude: locationData.longitude || req.body.longitude,
      ...req.body
    });

    // Update organization student count
    organization.totalStudents += 1;
    await organization.save({ validateBeforeSave: false });

    // Generate verification token
    const verificationToken = student.createVerificationToken();
    await student.save({ validateBeforeSave: false });

    createSendToken(student, 201, res, 'student');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message
    });
  }
};

/**
 * Login Student
 * POST /api/auth/student/login
 */
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Find student
    const student = await Student.findOne({ email })
      .select('+password')
      .populate('organization', 'organizationName location')
      .populate('classTeacher', 'name subject');

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!student.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated'
      });
    }

    // If password is provided, verify it
    if (password) {
      const isPasswordCorrect = await student.comparePassword(password);
      
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }

    // Update last login
    student.lastLogin = Date.now();
    await student.save({ validateBeforeSave: false });

    createSendToken(student, 200, res, 'student');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};



/**
 * Verify Email
 * GET /api/auth/verify-email/:token
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { role } = req.query; // organization, teacher, or student

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    let Model;
    switch (role) {
      case 'organization':
        Model = Organization;
        break;
      case 'teacher':
        Model = Teacher;
        break;
      case 'student':
        Model = Student;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
    }

    const user = await Model.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
};

/**
 * Get Current User
 * GET /api/auth/me
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const { id, role } = req.user;

    let Model;
    switch (role) {
      case 'organization':
        Model = Organization;
        break;
      case 'teacher':
        Model = Teacher;
        break;
      case 'student':
        Model = Student;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
    }

    const user = await Model.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};