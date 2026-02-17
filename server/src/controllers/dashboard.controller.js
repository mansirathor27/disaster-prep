/**
 * Dashboard Controllers
 * Handles dashboard data for Organization, Teacher, and Student
 */

const Organization = require('../models/Organization.model');
const Teacher = require('../models/Teacher.model');
const Student = require('../models/Student.model');
const Progress = require('../models/Progress.model');
require('../models/Badge.model');

// =============================================
// ORGANIZATION DASHBOARD
// =============================================

/**
 * Get Organization Dashboard Data
 * GET /api/dashboard/organization
 */
// Add this to your dashboard.controller.js - somewhere after the existing methods

/**
 * Get Students under a specific teacher
 * GET /api/organizations/teacher/:teacherId/students
 * This matches the endpoint your frontend is calling
 */
exports.getTeacherStudents = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const organizationId = req.user.id;

    console.log(`Fetching students for teacher: ${teacherId}, organization: ${organizationId}`);

    // Verify teacher belongs to organization
    const teacher = await Teacher.findOne({
      _id: teacherId,
      organization: organizationId
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found or does not belong to your organization'
      });
    }

    // Get students with progress data
    const students = await Student.find({ classTeacher: teacherId })
      .select('name rollNumber email class progress lastLogin isActive')
      .lean();

    // Enhance student data with progress stats
    const enhancedStudents = students.map(student => ({
      ...student,
      progressSummary: {
        totalScore: student.progress?.totalScore || 0,
        badgesCount: student.progress?.badges?.length || 0,
        modulesCompleted: student.progress?.modulesCompleted?.length || 0
      }
    }));

    res.status(200).json({
      success: true,
      data: enhancedStudents
    });

  } catch (error) {
    console.error('Error in getTeacherStudents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher students',
      error: error.message
    });
  }
};
exports.getOrganizationDashboard = async (req, res) => {
  try {
    const organizationId = req.user.id;

    // Get organization details
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Get all teachers with their assigned classes
    const teachers = await Teacher.find({ organization: organizationId })
      .select('name email subject classTeacher isActive lastLogin phone qualification experience dateOfJoining bio emailVerified profilePicture')
      .sort({ 'classTeacher.grade': 1, 'classTeacher.section': 1 });

    // Get student count by class
    const studentsByClass = await Student.aggregate([
      { $match: { organization: organizationId } },
      {
        $group: {
          _id: { 
            grade: '$class.grade', 
            section: '$class.section' 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.grade': 1, '_id.section': 1 } }
    ]);

    // Get overall statistics
    const stats = {
      totalTeachers: teachers.length,
      activeTeachers: teachers.filter(t => t.isActive).length,
      totalStudents: organization.totalStudents,
      totalClasses: studentsByClass.length
    };

    res.status(200).json({
      success: true,
      data: {
        organization: {
          name: organization.organizationName,
          location: organization.location,
          email: organization.email,
          type: organization.organizationType
        },
        stats,
        teachers,
        studentsByClass
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching organization dashboard',
      error: error.message
    });
  }
};

/**
 * Get Teachers by Class
 * GET /api/dashboard/organization/teachers/:grade/:section
 */
exports.getTeachersByClass = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const { grade, section } = req.params;

    const teacher = await Teacher.findOne({
      organization: organizationId,
      'classTeacher.grade': grade,
      'classTeacher.section': section || 'A'
    }).populate('students');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'No teacher found for this class'
      });
    }

    res.status(200).json({
      success: true,
      data: { teacher }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher details',
      error: error.message
    });
  }
};

// =============================================
// TEACHER DASHBOARD
// =============================================

/**
 * Get Teacher Dashboard Data
 * GET /api/dashboard/teacher
 */
exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get teacher details
    const teacher = await Teacher.findById(teacherId)
      .populate('organization', 'organizationName location');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get all students in teacher's class
    const students = await Student.find({ 
      classTeacher: teacherId 
    })
      .select('name rollNumber email class progress lastLogin isActive')
      .sort({ rollNumber: 1 });

    // Calculate class statistics - handle undefined progress gracefully
    const stats = {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.isActive).length,
      averageScore: students.reduce((sum, s) => sum + (s.progress?.totalScore || 0), 0) / students.length || 0,
      completionRate: students.filter(s => s.progress?.modulesCompleted?.length > 0).length / students.length * 100 || 0
    };

    res.status(200).json({
      success: true,
      data: {
        teacher: {
          name: teacher.name,
          subject: teacher.subject,
          class: teacher.classTeacher,
          organization: teacher.organization
        },
        stats,
        students
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher dashboard',
      error: error.message
    });
  }
};

/**
 * Get Student Progress Details
 * GET /api/dashboard/teacher/student/:studentId
 */
exports.getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;

    // Verify student belongs to this teacher
    const student = await Student.findOne({
      _id: studentId,
      classTeacher: teacherId
    })
      .populate('progress.modulesCompleted')
      .populate('progress.quizzesCompleted')
      .populate('progress.gamesCompleted')
      .populate('progress.badges')
      .lean({ virtuals: true });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or not in your class'
      });
    }

    // Get detailed progress data - Note: Progress model uses 'userId' not 'user'
    const progressDetails = await Progress.find({
      userId: studentId
    })
      .sort({ createdAt: -1 })
      .lean();

    const {
      name,
      email,
      rollNumber,
      class: classInfo,
      dateOfBirth,
      gender,
      phone,
      parentPhone,
      parentEmail,
      profilePicture,
      enrollmentDate,
      lastLogin,
      progress = {}
    } = student;

    res.status(200).json({
      success: true,
      data: {
        student: {
          name,
          email,
          rollNumber,
          class: classInfo,
          dateOfBirth,
          gender,
          phone,
          parentPhone,
          parentEmail,
          profilePicture,
          enrollmentDate,
          lastLogin
        },
        progress,
        progressDetails
      }
    });

  } catch (error) {
    console.error('Error in getStudentProgress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student progress',
      error: error.message
    });
  }
};

// =============================================
// STUDENT DASHBOARD
// =============================================

/**
 * Get Student Dashboard Data
 * GET /api/dashboard/student
 */
exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student details
    const student = await Student.findById(studentId)
      .populate('organization', 'organizationName location')
      .populate('classTeacher', 'name subject');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get detailed progress - Note: Progress model uses 'userId' not 'user'
    const progressDetails = await Progress.find({
      userId: studentId
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate statistics
    const stats = {
      totalScore: student.progress?.totalScore || 0,
      totalBadges: student.progress?.badges?.length || 0,
      modulesCompleted: student.progress?.modulesCompleted?.length || 0,
      quizzesCompleted: student.progress?.quizzesCompleted?.length || 0,
      gamesCompleted: student.progress?.gamesCompleted?.length || 0
    };

    res.status(200).json({
      success: true,
      data: {
        student: {
          name: student.name,
          rollNumber: student.rollNumber,
          class: student.class,
          organization: student.organization,
          classTeacher: student.classTeacher
        },
        stats,
        badges: student.progress?.badges || [],
        recentProgress: progressDetails
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student dashboard',
      error: error.message
    });
  }
};

/**
 * Get Available Modules/Quizzes/Games
 * GET /api/dashboard/student/content
 */
exports.getStudentContent = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student with organization location for disaster priority
    const student = await Student.findById(studentId)
      .populate('organization', 'location');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get disaster priority based on location
    const disasterPriority = student.organization.location.disasterPriority || [];

    // Return available content
    // TODO: Implement actual content filtering based on location
    res.status(200).json({
      success: true,
      data: {
        location: student.organization.location,
        disasterPriority,
        message: 'Content will be personalized based on your location'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};