/**
 * Disaster Response Platform - Main Application Entry Point
 * A location-aware disaster response training platform for primary school students
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const connectDatabase = require('./config/database.config');
const appConfig = require('./config/app.config');
const { requestLogger, responseTimeLogger } = require('./middleware/logger.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// CORS Configuration
app.use(cors(appConfig.cors));
// 🔥 ADD THIS - Enable ALL origins for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
// Log incoming origin and method for debugging (helps track CORS/preflight issues)
app.use((req, res, next) => {
  try {
    const origin = req.headers.origin || 'no-origin';
    console.log(`➡️  Incoming request: ${req.method} ${req.url} (Origin: ${origin})`);
  } catch (e) {}
  next();
});

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
if (appConfig.server.env !== 'test') {
  app.use(requestLogger);
  app.use(responseTimeLogger);
}

// ==================== ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Disaster Response Platform API is running',
    environment: appConfig.server.env,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const authRoutes = require('./routes/auth.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');
const organizationRoutes = require('./routes/organization.routes');
const teacherRoutes = require('./routes/teacher.routes');
// const locationRoutes = require('./routes/location.routes');
// const disasterRoutes = require('./routes/disaster.routes');
// const quizRoutes = require('./routes/quiz.routes');
// const badgeRoutes = require('./routes/badge.routes');
// const moduleProgressRoutes = require('./routes/module-progress.routes');

// Authentication & Dashboard Routes (New)
app.use(`${appConfig.server.apiPrefix}/auth`, authRoutes);
// app.use(`${appConfig.server.apiPrefix}/dashboard`, dashboardRoutes);
app.use(`${appConfig.server.apiPrefix}/organizations`, organizationRoutes);
app.use(`${appConfig.server.apiPrefix}/teacher`, teacherRoutes);
// // Existing Routes
// app.use(`${appConfig.server.apiPrefix}/location`, locationRoutes);
// app.use(`${appConfig.server.apiPrefix}/disasters`, disasterRoutes);
// app.use(`${appConfig.server.apiPrefix}/module-progress`, moduleProgressRoutes);
// app.use(`${appConfig.server.apiPrefix}/quiz`, quizRoutes);
// app.use(`${appConfig.server.apiPrefix}/badges`, badgeRoutes);

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    name: 'Disaster Response Training Platform API',
    version: '2.0.0',
    description: 'Location-aware disaster response training for schools with multi-level authentication',
    endpoints: {
      health: '/health',
      auth: `${appConfig.server.apiPrefix}/auth`,
    //   dashboard: `${appConfig.server.apiPrefix}/dashboard`,
    //   location: `${appConfig.server.apiPrefix}/location`,
    //   disasters: `${appConfig.server.apiPrefix}/disasters`,
    //   moduleProgress: `${appConfig.server.apiPrefix}/module-progress`,
    //   quiz: `${appConfig.server.apiPrefix}/quiz`,
    //   badges: `${appConfig.server.apiPrefix}/badges`,
    },
    userTypes: ['organization', 'teacher', 'student']
  });
});

// ==================== ERROR HANDLING ====================

// 404 Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// ==================== SERVER INITIALIZATION ====================

const startServer = async () => {
  try {
    // Connect to Database
    await connectDatabase();
    
    // Start Server
    const PORT = appConfig.server.port;
    const server = app.listen(PORT, () => {
      console.log('\n🚀 ========================================');
      console.log('   DISASTER RESPONSE PLATFORM API');
      console.log('   ========================================');
      console.log(`   📍 Environment: ${appConfig.server.env}`);
      console.log(`   🌐 Server: http://localhost:${PORT}`);
      console.log(`   🔌 API Base: ${appConfig.server.apiPrefix}`);
      console.log(`   💾 Database: Connected`);
      console.log('   ========================================\n');
    });

    server.on('error', (err) => {
      console.error('❌ Server failed to start:', err && err.message ? err.message : err);
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Free the port or change PORT in .env`);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
