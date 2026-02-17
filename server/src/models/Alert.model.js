/**
 * Alert Model
 * Represents disaster alerts for organizations
 */

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  // Organization that receives the alert
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  
  // Alert type
  type: {
    type: String,
    enum: ['Earthquake', 'Flood', 'Cyclone', 'Fire', 'Tsunami', 'Landslide', 'Storm', 'Other'],
    required: true
  },
  
  // Severity level
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'moderate'
  },
  
  // Alert title
  title: {
    type: String,
    required: true
  },
  
  // Alert description
  description: {
    type: String,
    required: true
  },
  
  // Location details
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    affectedAreas: [String]
  },
  
  // Time information
  issuedAt: {
    type: Date,
    default: Date.now
  },
  
  effectiveFrom: {
    type: Date,
    required: true
  },
  
  effectiveUntil: {
    type: Date,
    required: true
  },
  
  // Source of the alert (e.g., Government Agency, Weather Service)
  source: {
    type: String,
    default: 'Disaster Management System'
  },
  
  // Source URL for more information
  sourceUrl: String,
  
  // Recommendations for recipients
  recommendations: [{
    type: String
  }],
  
  // Safety instructions
  safetyInstructions: [{
    type: String
  }],
  
  // Affected entities
  affectedTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  
  affectedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  
  // Alert status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'resolved'],
    default: 'active'
  },
  
  // Who created/issued the alert
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  
  // Alert metadata
  meta: {
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    isTest: {
      type: Boolean,
      default: false
    },
    acknowledged: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'meta.acknowledged.userModel'
      },
      userModel: {
        type: String,
        enum: ['Teacher', 'Student', 'Organization']
      },
      acknowledgedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    acknowledgedCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
alertSchema.index({ organization: 1, status: 1 });
alertSchema.index({ effectiveFrom: 1, effectiveUntil: 1 });
alertSchema.index({ type: 1, severity: 1 });
alertSchema.index({ 'location.city': 1, 'location.state': 1 });

// Virtual for checking if alert is active
alertSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.effectiveFrom && 
         now <= this.effectiveUntil;
});

// Virtual for time remaining
alertSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  if (now > this.effectiveUntil) return 0;
  return this.effectiveUntil - now;
});

// Method to acknowledge alert
alertSchema.methods.acknowledge = async function(userId, userModel) {
  // Check if already acknowledged
  const alreadyAcknowledged = this.meta.acknowledged.some(
    a => a.user.toString() === userId.toString()
  );
  
  if (!alreadyAcknowledged) {
    this.meta.acknowledged.push({
      user: userId,
      userModel
    });
    this.stats.acknowledgedCount = this.meta.acknowledged.length;
    await this.save();
  }
  
  return this;
};

// Method to increment view count
alertSchema.methods.incrementViews = async function() {
  this.stats.views += 1;
  await this.save();
  return this;
};

// Static method to get active alerts for organization
alertSchema.statics.getActiveAlerts = async function(organizationId) {
  const now = new Date();
  return this.find({
    organization: organizationId,
    status: 'active',
    effectiveFrom: { $lte: now },
    effectiveUntil: { $gte: now }
  }).sort({ severity: -1, effectiveFrom: -1 });
};

// Static method to get alerts by severity
alertSchema.statics.getBySeverity = async function(organizationId, severity) {
  return this.find({
    organization: organizationId,
    severity,
    status: 'active'
  }).sort({ effectiveFrom: -1 });
};

// Pre-save middleware
alertSchema.pre('save', function(next) {
  // Auto-update status based on effective dates
  const now = new Date();
  
  if (this.status === 'active') {
    if (now > this.effectiveUntil) {
      this.status = 'expired';
    } else if (now < this.effectiveFrom) {
      // Still scheduled, keep as active but note it's not yet effective
      // You might want to add a 'scheduled' status if needed
    }
  }
  
  next();
});

// Create the model
const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;