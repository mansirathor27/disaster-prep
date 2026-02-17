/**
 * Organization Routes - COMPLETE VERSION
 * All organization endpoints in one place
 */

const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organization.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// =============================================
// PUBLIC ROUTES (No Authentication Required)
// =============================================

// Get list of all organizations for registration dropdown
router.get('/list', organizationController.getOrganizationsList);

// Check if organization name exists
router.get('/check/:name', organizationController.checkOrganization);

// =============================================
// DASHBOARD & STATS (All protected)
// =============================================

// Main dashboard data
router.get(
  '/dashboard',
  protect,
  restrictTo('organization'),
  organizationController.getDashboard
);

// Analytics data
router.get(
  '/analytics',
  protect,
  restrictTo('organization'),
  organizationController.getAnalytics
);

// Export data
router.get(
  '/export',
  protect,
  restrictTo('organization'),
  organizationController.exportData
);

// =============================================
// TEACHER MANAGEMENT
// =============================================

// Get all teachers
router.get(
  '/teachers',
  protect,
  restrictTo('organization'),
  organizationController.getTeachers
);

// Get teachers by class
router.get(
  '/teachers/class/:grade/:section',
  protect,
  restrictTo('organization'),
  organizationController.getTeachersByClass
);

// =============================================
// STUDENT MANAGEMENT
// =============================================

// Get all students
router.get(
  '/students',
  protect,
  restrictTo('organization'),
  organizationController.getStudents
);

// Get students under a specific teacher
router.get(
  '/teacher/:teacherId/students',
  protect,
  restrictTo('organization'),
  organizationController.getTeacherStudents
);

// =============================================
// DRILL MANAGEMENT
// =============================================

// Get all drills
router.get(
  '/drills',
  protect,
  restrictTo('organization'),
  organizationController.getDrills
);

// Schedule a new drill
router.post(
  '/drills',
  protect,
  restrictTo('organization'),
  organizationController.scheduleDrill
);

// Update drill status
router.patch(
  '/drills/:drillId',
  protect,
  restrictTo('organization'),
  organizationController.updateDrillStatus
);

// =============================================
// ALERTS & NOTIFICATIONS
// =============================================

// Get disaster alerts
router.get(
  '/alerts',
  protect,
  restrictTo('organization'),
  organizationController.getDisasterAlerts
);

// Broadcast emergency alert
router.post(
  '/alerts/broadcast',
  protect,
  restrictTo('organization'),
  organizationController.broadcastAlert
);

module.exports = router;