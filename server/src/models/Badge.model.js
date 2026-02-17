const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    badgeId: {
      type: String,
      required: [true, 'Badge ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
      minlength: [3, 'Badge name must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Badge icon is required'],
    },
    category: {
      type: String,
      enum: {
        values: ['disaster-specific', 'achievement', 'milestone', 'special'],
        message: '{VALUE} is not a valid badge category',
      },
      required: [true, 'Badge category is required'],
    },
    criteria: {
      type: {
        type: String,
        enum: {
          values: ['score', 'completion', 'streak', 'speed', 'perfect'],
          message: '{VALUE} is not a valid criteria type',
        },
        required: true,
      },
      requirement: {
        type: Number,
        required: true,
        min: [1, 'Requirement must be at least 1'],
      },
      description: {
        type: String,
        trim: true,
      },
    },
    rarity: {
      type: String,
      enum: {
        values: ['common', 'rare', 'epic', 'legendary'],
        message: '{VALUE} is not a valid rarity level',
      },
      default: 'common',
    },
    color: {
      type: String,
      default: '#667eea',
      match: [/^#[0-9A-F]{6}$/i, 'Invalid color format. Use hex format (#RRGGBB)'],
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
badgeSchema.index({ category: 1, rarity: 1 });
badgeSchema.index({ isActive: 1 });

// Virtual for display text
badgeSchema.virtual('displayText').get(function () {
  return `${this.icon} ${this.name} - ${this.rarity.toUpperCase()}`;
});

// Static method to find badges by category
badgeSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({ rarity: 1, createdAt: -1 });
};

// Static method to find badges by rarity
badgeSchema.statics.findByRarity = function (rarity) {
  return this.find({ rarity, isActive: true }).sort({ category: 1, createdAt: -1 });
};

// Method to check if user meets badge criteria
badgeSchema.methods.checkCriteria = function (userStats) {
  const { type, requirement } = this.criteria;
  
  switch (type) {
    case 'score':
      return userStats.totalScore >= requirement;
    case 'completion':
      return userStats.completedModules >= requirement;
    case 'streak':
      return userStats.currentStreak >= requirement;
    case 'speed':
      return userStats.averageTime <= requirement;
    case 'perfect':
      return userStats.perfectScores >= requirement;
    default:
      return false;
  }
};

module.exports = mongoose.model('Badge', badgeSchema);
