// models/Resource.model.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['document', 'video', 'presentation', 'guide', 'checklist'],
    required: true
  },
  category: {
    type: String,
    enum: ['earthquake', 'fire', 'flood', 'cyclone', 'tsunami', 'general'],
    required: true
  },
  url: String,
  fileUrl: String,
  fileSize: Number,
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  }
});

resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);