
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    class: {
      grade: {
        type: Number,
        required: [true, 'Class grade is required'],
        min: 1,
        max: 12,
      },
      section: {
        type: String,
        default: 'A',
        uppercase: true,
        trim: true,
      },
    },

    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
    },

    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    phone: String,
    parentPhone: String,
    parentEmail: String,

    // Location fields for disaster alerts
    city: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    profilePicture: String,

    progress: {
      modulesCompleted: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Progress' },
      ],
      quizzesCompleted: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Progress' },
      ],
      gamesCompleted: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Progress' },
      ],
      totalScore: {
        type: Number,
        default: 0,
      },
      badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: Date,
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.index(
  {
    organization: 1,
    'class.grade': 1,
    'class.section': 1,
    rollNumber: 1,
  },
  { unique: true }
);

studentSchema.index({ organization: 1, classTeacher: 1 });

// Geospatial index for location-based queries
studentSchema.index({ latitude: 1, longitude: 1 });
studentSchema.index({ city: 1 });


studentSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

studentSchema.methods.createVerificationToken = function () {
  const crypto = require('crypto');

  const token = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

  return token;
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
