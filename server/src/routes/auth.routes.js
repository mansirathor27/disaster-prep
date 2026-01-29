/**
 * Authentication Routes
 * Routes for registration, login, and email verification
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');


router.post('/organization/register', authController.registerOrganization);
router.post('/organization/login', authController.loginOrganization);

router.post('/teacher/register', authController.registerTeacher);
router.post('/teacher/login', authController.loginTeacher);


router.post('/student/register', authController.registerStudent);
router.post('/student/login', authController.loginStudent);


router.get('/verify-email/:token', authController.verifyEmail);


router.get('/me', protect, authController.getCurrentUser);

module.exports = router;