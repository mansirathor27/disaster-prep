
require('dotenv').config();

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5001,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: '/api',
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-response',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // CORS Configuration
  // Accept a comma-separated list via env var `CORS_ORIGIN` or default to common dev origins
  cors: {
    origin: (origin, callback) => {
      const allowed = (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.split(',')) || ['http://localhost:3000', 'http://localhost:3001'];
      // Allow non-browser requests like curl or server-to-server
      if (!origin) return callback(null, true);
      if (allowed.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      // Deny by returning false (don't throw) so preflight doesn't crash middleware
      return callback(null, false);
    },
    credentials: true,
  },

  // Application Limits
  limits: {
    maxAge: 15,
    minAge: 5,
    maxAttempts: 3,
    sessionTimeout: 3600000, // 1 hour in milliseconds
  },

  // Supported Languages
  languages: [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Bengali',
    'Marathi',
    'Gujarati',
    'Kannada',
    'Malayalam',
  ],

  // Game Configuration
  game: {
    defaultTimeLimit: 300, // 5 minutes in seconds
    pointsPerCorrectAnswer: 100,
    bonusMultiplier: 1.5,
  },

  // Quiz Configuration
  quiz: {
    passingPercentage: 60,
    maxQuestions: 10,
  },
};
