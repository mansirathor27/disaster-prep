const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-response';

    console.log('🔌 Attempting to connect to MongoDB...');
    
    const connection = await mongoose.connect(mongoUri);


    return connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log(
        '⚠️  Running in development mode without database connection'
      );
    }
  }
};

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDatabase;
