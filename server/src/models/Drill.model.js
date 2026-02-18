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
  scheduledDate: {
    type: Date,
    required: true
  },
  time: String,
  duration: Number,
  expectedParticipants: Number,
  location: String,
  notes: String,
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,  // ✅ CHANGE from Number to ObjectId
    ref: 'Student'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
}, { timestamps: true });

module.exports = mongoose.model('Drill', drillSchema);