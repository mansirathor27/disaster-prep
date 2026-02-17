/**
 * Dashboard Routes
 * Routes for organization, teacher, and student dashboards
 * SIMPLIFIED VERSION - Only uses existing controller methods
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// =============================================
// ORGANIZATION DASHBOARD ROUTES
// =============================================

/**
 * GET /api/dashboard/organization
 * Get organization dashboard data
 * Access: Organization only
 */
router.get(
  '/organization',
  protect,
  restrictTo('organization'),
  dashboardController.getOrganizationDashboard
);

/**
 * GET /api/dashboard/organization/teachers/:grade/:section
 * Get teachers by class
 * Access: Organization only
 */
router.get(
  '/organization/teachers/:grade/:section',
  protect,
  restrictTo('organization'),
  dashboardController.getTeachersByClass
);

// =============================================
// TEACHER DASHBOARD ROUTES
// =============================================

/**
 * GET /api/dashboard/teacher
 * Get teacher dashboard data
 * Access: Teacher only
 */
router.get(
  '/teacher',
  protect,
  restrictTo('teacher'),
  dashboardController.getTeacherDashboard
);

/**
 * GET /api/dashboard/teacher/student/:studentId
 * Get student progress details
 * Access: Teacher only
 */
router.get(
  '/teacher/student/:studentId',
  protect,
  restrictTo('teacher'),
  dashboardController.getStudentProgress
);

// =============================================
// STUDENT DASHBOARD ROUTES
// =============================================

/**
 * GET /api/dashboard/student
 * Get student dashboard data
 * Access: Student only
 */
router.get(
  '/student',
  protect,
  restrictTo('student'),
  dashboardController.getStudentDashboard
);

/**
 * GET /api/dashboard/student/content
 * Get available learning content
 * Access: Student only
 */
router.get(
  '/student/content',
  protect,
  restrictTo('student'),
  dashboardController.getStudentContent
);

module.exports = router;