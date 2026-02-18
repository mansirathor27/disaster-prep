/**
 * Teacher Routes - COMPLETE VERSION
 * All teacher endpoints in one place
 */

const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All teacher routes require authentication and teacher role
router.use(protect);
router.use(restrictTo('teacher'));

// =============================================
// DASHBOARD
// =============================================
router.get('/dashboard', teacherController.getDashboard);

// =============================================
// CLASS MANAGEMENT
// =============================================
router.get('/my-class', teacherController.getMyClass);
router.get('/student/:studentId', teacherController.getStudentProgress);

// =============================================
// ATTENDANCE MANAGEMENT
// =============================================
router.post('/attendance', teacherController.markAttendance);
router.post('/attendance/bulk', teacherController.markBulkAttendance);

// =============================================
// DRILL MANAGEMENT
// =============================================
router.get('/drills/upcoming', teacherController.getUpcomingDrills);

// =============================================
// PARENT COMMUNICATION
// =============================================
router.post('/message-parent', teacherController.sendMessageToParent);

// =============================================
// ACTIVITIES
// =============================================
router.get('/recent-activities', teacherController.getRecentActivities);
// =============================================
// DRILL RECOMMENDATION ROUTES
// =============================================
router.get(
  '/recommended-drills',
  protect,
  restrictTo('teacher'),
  teacherController.getRecommendedDrills
);

router.post(
  '/schedule-drill',
  protect,
  restrictTo('teacher'),
  teacherController.scheduleRecommendedDrill
);

router.get(
  '/drill-history',
  protect,
  restrictTo('teacher'),
  teacherController.getDrillHistory
);
module.exports = router;