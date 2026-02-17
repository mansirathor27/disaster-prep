const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    moduleId: {
      type: String,
      required: [true, 'Module ID is required'],
      trim: true,
    },
    moduleType: {
      type: String,
      required: [true, 'Module type is required'],
      enum: {
        values: ['game', 'quiz', 'video', 'simulation', 'reading'],
        message: '{VALUE} is not a valid module type',
      },
    },
    disasterType: {
      type: String,
      required: [true, 'Disaster type is required'],
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
    maxScore: {
      type: Number,
      required: [true, 'Maximum score is required'],
      min: [1, 'Maximum score must be at least 1'],
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
      min: 0,
    },
    attempts: {
      type: Number,
      default: 1,
      min: 1,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        userAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        pointsEarned: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
progressSchema.index({ userId: 1, createdAt: -1 });
progressSchema.index({ userId: 1, moduleId: 1 });
progressSchema.index({ userId: 1, disasterType: 1 });
progressSchema.index({ moduleType: 1, disasterType: 1 });

// Pre-save middleware to calculate percentage
progressSchema.pre('save', function (next) {
  if (this.score !== undefined && this.maxScore !== undefined) {
    this.percentage = Math.round((this.score / this.maxScore) * 100);
  }
  next();
});

// Virtual for pass/fail status
progressSchema.virtual('isPassed').get(function () {
  return this.percentage >= 60;
});

// Method to add answer
progressSchema.methods.addAnswer = function (answerData) {
  this.answers.push(answerData);
  return this;
};

// Static method to get user statistics
progressSchema.statics.getUserStats = async function (userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$moduleType',
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        totalTimeTaken: { $sum: '$timeTaken' },
        completedCount: {
          $sum: { $cond: ['$completed', 1, 0] },
        },
      },
    },
  ]);
};

// Static method to get disaster-wise progress
progressSchema.statics.getDisasterProgress = async function (userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$disasterType',
        moduleCount: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        completedCount: {
          $sum: { $cond: ['$completed', 1, 0] },
        },
      },
    },
    { $sort: { averageScore: -1 } },
  ]);
};

module.exports = mongoose.model('Progress', progressSchema);
