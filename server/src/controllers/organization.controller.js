
const Organization = require('../models/Organization.model');
const Teacher = require('../models/Teacher.model');
const Student = require('../models/Student.model');
const Progress = require('../models/Progress.model');
const Drill = require('../models/Drill.model');
const Alert = require('../models/Alert.model');
const Notification = require('../models/Notification.model');

/**
 * Get list of all organizations (for registration dropdown)
 * GET /api/organizations/list
 */
exports.getOrganizationsList = async (req, res) => {
  try {
    const organizations = await Organization.find({}, 'organizationName location email');
    res.status(200).json({
      success: true,
      data: organizations
    });
  } catch (error) {
    console.error('Error in getOrganizationsList:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Check if organization name exists
 * GET /api/organizations/check/:name
 */
exports.checkOrganization = async (req, res) => {
  try {
    const { name } = req.params;
    const organization = await Organization.findOne({ organizationName: name });
    res.status(200).json({
      success: true,
      exists: !!organization
    });
  } catch (error) {
    console.error('Error in checkOrganization:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Organization Dashboard Data
 * GET /api/organizations/dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const organizationId = req.user.id;

    const [
      organization,
      teachers,
      studentsByClass,
      recentActivities,
      upcomingDrills,
      performanceMetrics
    ] = await Promise.all([
      Organization.findById(organizationId),
      Teacher.find({ organization: organizationId })
        .select('name email subject classTeacher isActive lastLogin phone qualification experience dateOfJoining bio')
        .lean(),
      Student.aggregate([
        { $match: { organization: organizationId } },
        {
          $group: {
            _id: { 
              grade: '$class.grade', 
              section: '$class.section' 
            },
            count: { $sum: 1 },
            activeStudents: { 
              $sum: { $cond: ['$isActive', 1, 0] } 
            }
          }
        },
        { $sort: { '_id.grade': 1, '_id.section': 1 } }
      ]),
      getRecentActivities(organizationId),
      Drill.find({ 
        organization: organizationId,
        scheduledDate: { $gte: new Date() }
      })
        .sort({ scheduledDate: 1 })
        .limit(5)
        .lean(),
      getPerformanceMetrics(organizationId)
    ]);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Get student counts for each teacher
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const studentCount = await Student.countDocuments({ 
          classTeacher: teacher._id 
        });
        
        const avgScore = await Progress.aggregate([
          { $match: { userId: { $in: await Student.find({ classTeacher: teacher._id }).distinct('_id') } } },
          { $group: { _id: null, avgScore: { $avg: '$score' } } }
        ]);

        return {
          ...teacher,
          studentCount,
          performanceScore: avgScore[0]?.avgScore || 0,
          lastActive: calculateLastActive(teacher.lastLogin)
        };
      })
    );

    const totalStudents = await Student.countDocuments({ 
      organization: organizationId 
    });

    const activeStudents = await Student.countDocuments({ 
      organization: organizationId,
      isActive: true 
    });

    const totalDrills = await Drill.countDocuments({ 
      organization: organizationId 
    });

    const completedDrills = await Drill.countDocuments({ 
      organization: organizationId,
      status: 'completed' 
    });

    const recentRegistrations = await Student.find({ 
      organization: organizationId 
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const stats = {
      totalTeachers: teachers.length,
      activeTeachers: teachers.filter(t => t.isActive).length,
      totalStudents,
      activeStudents,
      totalClasses: studentsByClass.length,
      totalDrills,
      completedDrills,
      completionRate: totalStudents > 0 ? (activeStudents / totalStudents * 100) : 0,
      averageScore: performanceMetrics.averageScore || 0,
      totalBadges: performanceMetrics.totalBadges || 0
    };

    res.status(200).json({
      success: true,
      data: {
        organization: {
          name: organization.organizationName,
          location: organization.location,
          email: organization.email,
          type: organization.organizationType,
          logo: organization.logo,
          contactNumber: organization.contactNumber,
          website: organization.website,
          establishedYear: organization.establishedYear
        },
        stats,
        teachers: teachersWithStats,
        studentsByClass,
        recentActivities,
        recentRegistrations,
        upcomingDrills,
        performanceMetrics
      }
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching organization dashboard',
      error: error.message
    });
  }
};

/**
 * Get Organization Analytics
 * GET /api/organizations/analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const { timeRange = 'month' } = req.query;

    let dateFilter = {};
    const now = new Date();
    
    if (timeRange === 'week') {
      dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    } else if (timeRange === 'month') {
      dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
    } else if (timeRange === 'year') {
      dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
    }

    const [studentGrowth, classPerformance, drillTrends] = await Promise.all([
      Student.aggregate([
        { $match: { organization: organizationId, createdAt: dateFilter } },
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      Student.aggregate([
        { $match: { organization: organizationId } },
        {
          $lookup: {
            from: 'progresses',
            localField: '_id',
            foreignField: 'userId',
            as: 'progress'
          }
        },
        {
          $group: {
            _id: { grade: '$class.grade', section: '$class.section' },
            averageScore: { $avg: { $arrayElemAt: ['$progress.totalScore', 0] } },
            studentCount: { $sum: 1 }
          }
        }
      ]),
      Drill.aggregate([
        { $match: { organization: organizationId, scheduledDate: dateFilter } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledDate' } },
            scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        studentGrowth,
        classPerformance,
        drillTrends,
        timeRange
      }
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

/**
 * Get all teachers in organization
 * GET /api/organizations/teachers
 */
exports.getTeachers = async (req, res) => {
  try {
    const organizationId = req.user.id;
    console.log('Fetching teachers for organization:', organizationId);
    
    const teachers = await Teacher.find({ organization: organizationId })
      .select('-password')
      .lean();
    
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const studentCount = await Student.countDocuments({ classTeacher: teacher._id });
        return {
          ...teacher,
          studentCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: teachersWithStats
    });
  } catch (error) {
    console.error('Error in getTeachers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get teachers by class
 * GET /api/organizations/teachers/class/:grade/:section
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

/**
 * Get all students in organization
 * GET /api/organizations/students
 */
exports.getStudents = async (req, res) => {
  try {
    const organizationId = req.user.id;
    console.log('Fetching students for organization:', organizationId);
    
    const students = await Student.find({ organization: organizationId })
      .select('-password')
      .populate('classTeacher', 'name')
      .lean();

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error in getStudents:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get students under a specific teacher
 * GET /api/organizations/teacher/:teacherId/students
 */
exports.getTeacherStudents = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const organizationId = req.user.id;

    console.log(`Fetching students for teacher: ${teacherId}, organization: ${organizationId}`);

    const teacher = await Teacher.findOne({
      _id: teacherId,
      organization: organizationId
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const students = await Student.find({ classTeacher: teacherId })
      .select('-password')
      .populate('progress', 'totalScore badges modulesCompleted')
      .lean();

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

/**
 * Get all drills
 * GET /api/organizations/drills
 */
exports.getDrills = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const { status } = req.query;
    
    const query = { organization: organizationId };
    if (status) query.status = status;
    
    const drills = await Drill.find(query)
      .sort({ scheduledDate: -1 })
      .lean();
      
    res.status(200).json({
      success: true,
      data: drills
    });
  } catch (error) {
    console.error('Get Drills Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drills',
      error: error.message
    });
  }
};

/**
 * Schedule Disaster Drill
 * POST /api/organizations/drills
 */
exports.scheduleDrill = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const { type, scheduledDate, time, duration, expectedParticipants, location, notes } = req.body;

    const drill = new Drill({
      organization: organizationId,
      type,
      scheduledDate,
      time,
      duration,
      expectedParticipants,
      location,
      notes,
      status: 'scheduled',
      createdBy: req.user.id
    });

    await drill.save();

    const teachers = await Teacher.find({ organization: organizationId });
    const notifications = teachers.map(teacher => ({
      recipient: teacher._id,
      recipientModel: 'Teacher',
      type: 'drill_scheduled',
      title: `New ${type} Drill Scheduled`,
      message: `A ${type} drill has been scheduled for ${new Date(scheduledDate).toLocaleDateString()} at ${time}`,
      data: { drillId: drill._id }
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: 'Drill scheduled successfully',
      data: drill
    });

  } catch (error) {
    console.error('Schedule Drill Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling drill',
      error: error.message
    });
  }
};

/**
 * Update drill status
 * PATCH /api/organizations/drills/:drillId
 */
exports.updateDrillStatus = async (req, res) => {
  try {
    const { drillId } = req.params;
    const { status } = req.body;
    
    const drill = await Drill.findByIdAndUpdate(
      drillId,
      { status },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: drill
    });
  } catch (error) {
    console.error('Update Drill Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating drill',
      error: error.message
    });
  }
};
/**
 * Get Disaster Alerts
 * GET /api/organizations/alerts
 */
exports.getDisasterAlerts = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const organization = await Organization.findById(organizationId);
    
    const alerts = generateDisasterAlerts(organization.location);

    res.status(200).json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Disaster Alerts Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching disaster alerts',
      error: error.message
    });
  }
};

/**
 * Broadcast emergency alert
 * POST /api/organizations/alerts/broadcast
 */
exports.broadcastAlert = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const { message, severity } = req.body;
    
    const [teachers, students] = await Promise.all([
      Teacher.find({ organization: organizationId }).distinct('_id'),
      Student.find({ organization: organizationId }).distinct('_id')
    ]);
    
    const notifications = [
      ...teachers.map(t => ({
        recipient: t,
        recipientModel: 'Teacher',
        type: 'emergency_alert',
        title: `${severity.toUpperCase()} ALERT`,
        message,
        data: { severity }
      })),
      ...students.map(s => ({
        recipient: s,
        recipientModel: 'Student',
        type: 'emergency_alert',
        title: `${severity.toUpperCase()} ALERT`,
        message,
        data: { severity }
      }))
    ];
    
    await Notification.insertMany(notifications);
    
    await Alert.create({
      organization: organizationId,
      type: 'Manual',
      severity,
      title: `${severity.toUpperCase()} Alert`,
      description: message,
      issuedAt: new Date(),
      effectiveFrom: new Date(),
      effectiveUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    res.status(200).json({
      success: true,
      message: 'Alert broadcast successfully'
    });
  } catch (error) {
    console.error('Broadcast Alert Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error broadcasting alert',
      error: error.message
    });
  }
};
/**
 * Export dashboard data
 * GET /api/organizations/export
 */
exports.exportData = async (req, res) => {
  try {
    const organizationId = req.user.id;
    const { format } = req.query;
    
    const [organization, teachers, students, drills] = await Promise.all([
      Organization.findById(organizationId),
      Teacher.find({ organization: organizationId }),
      Student.find({ organization: organizationId }),
      Drill.find({ organization: organizationId })
    ]);
    
    const exportData = {
      organization: {
        name: organization.organizationName,
        location: organization.location,
        email: organization.email,
        contactNumber: organization.contactNumber
      },
      stats: {
        totalTeachers: teachers.length,
        activeTeachers: teachers.filter(t => t.isActive).length,
        totalStudents: students.length,
        activeStudents: students.filter(s => s.isActive).length,
        totalDrills: drills.length,
        completedDrills: drills.filter(d => d.status === 'completed').length
      },
      teachers,
      students,
      drills,
      exportedAt: new Date()
    };
    
    if (format === 'csv') {
      const csv = convertToCSV(exportData);
      res.header('Content-Type', 'text/csv');
      res.attachment(`dashboard-export-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: exportData
      });
    }
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};

// =============================================
// HELPER FUNCTIONS
// =============================================

const getRecentActivities = async (organizationId) => {
  const activities = [];

  const [recentTeacherLogins, recentRegistrations, recentDrills] = await Promise.all([
    Teacher.find({ organization: organizationId, lastLogin: { $exists: true, $ne: null } })
      .sort({ lastLogin: -1 })
      .limit(3)
      .select('name lastLogin'),
    Student.find({ organization: organizationId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt'),
    Drill.find({ organization: organizationId, status: 'completed' })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('type updatedAt')
  ]);

  recentTeacherLogins.forEach(teacher => {
    activities.push({
      type: 'teacher_login',
      description: `${teacher.name} logged in`,
      timestamp: teacher.lastLogin,
      icon: 'user'
    });
  });

  recentRegistrations.forEach(student => {
    activities.push({
      type: 'student_registered',
      description: `${student.name} registered`,
      timestamp: student.createdAt,
      icon: 'user-plus'
    });
  });

  recentDrills.forEach(drill => {
    activities.push({
      type: 'drill_completed',
      description: `${drill.type} drill completed`,
      timestamp: drill.updatedAt,
      icon: 'check-circle'
    });
  });

  return activities.sort((a, b) => b.timestamp - a.timestamp);
};

const getPerformanceMetrics = async (organizationId) => {
  const students = await Student.find({ organization: organizationId }).distinct('_id');
  
  const [averageScore, totalBadges] = await Promise.all([
    Progress.aggregate([
      { $match: { userId: { $in: students } } },
      { $group: { _id: null, avgScore: { $avg: '$totalScore' } } }
    ]),
    Progress.aggregate([
      { $match: { userId: { $in: students } } },
      { $project: { badgesCount: { $size: '$badges' } } },
      { $group: { _id: null, total: { $sum: '$badgesCount' } } }
    ])
  ]);

  return {
    averageScore: averageScore[0]?.avgScore || 0,
    totalBadges: totalBadges[0]?.total || 0
  };
};

const calculateLastActive = (lastLogin) => {
  if (!lastLogin) return 'Never';
  
  const now = new Date();
  const diffMs = now - new Date(lastLogin);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(lastLogin).toLocaleDateString();
};

const generateDisasterAlerts = (location) => {
  const alerts = [];
  const disasterTypes = ['Earthquake', 'Flood', 'Cyclone', 'Fire', 'Tsunami'];
  const severities = ['low', 'moderate', 'high', 'critical'];
  
  const numAlerts = Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < numAlerts; i++) {
    alerts.push({
      id: i + 1,
      type: disasterTypes[Math.floor(Math.random() * disasterTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      location: `${location.city || 'Unknown'}, ${location.state || 'Unknown'}`,
      time: `${Math.floor(Math.random() * 12) + 1} hours ago`,
      description: `${disasterTypes[i]} warning issued`,
      recommendations: [
        'Stay alert',
        'Follow emergency procedures',
        'Monitor local news'
      ]
    });
  }
  
  return alerts;
};

const convertToCSV = (data) => {
  let csv = 'Type,Name,Count\n';
  csv += `Teachers,Total,${data.stats.totalTeachers}\n`;
  csv += `Students,Total,${data.stats.totalStudents}\n`;
  csv += `Drills,Total,${data.stats.totalDrills}\n`;
  return csv;
};

module.exports = exports;