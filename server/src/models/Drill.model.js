// models/Drill.model.js
const mongoose = require('mongoose');

const drillSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  type: {
    type: String,
    enum: ['Earthquake', 'Fire', 'Flood', 'Cyclone', 'Tsunami', 'Landslide', 'Other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  participants: {
    type: Number,
    default: 0
  },
  location: {
    building: String,
    area: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: String,
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'feedback.userModel'
    },
    userModel: {
      type: String,
      enum: ['Teacher', 'Student']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

drillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Drill', drillSchema);