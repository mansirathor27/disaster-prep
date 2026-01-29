const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      unique: true,
    },

    organizationType: {
      type: String,
      enum: ['school', 'organization', 'institution'],
      default: 'school',
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

    location: {
      state: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      district: { type: String, trim: true },
      pincode: {
        type: String,
        match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
      },
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
      disasterPriority: [
        {
          type: String,
          enum: [
            'earthquake',
            'flood',
            'cyclone',
            'fire',
            'tsunami',
            'landslide',
            'drought',
          ],
        },
      ],
    },

    contactPerson: {
      name: String,
      phone: String,
      designation: String,
    },

    establishedYear: Number,
    totalTeachers: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },

    verificationToken: String,
    verificationTokenExpires: Date,

    isActive: { type: Boolean, default: true },

    subscriptionPlan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free',
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


organizationSchema.virtual('teachers', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'organization',
});

organizationSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'organization',
});

organizationSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

organizationSchema.pre('save', async function () {
  if (
    this.location &&
    this.location.state &&
    this.location.city &&
    (!this.location.latitude || !this.location.longitude)
  ) {
    try {
      const { getCoordinates } = require('../services/geocoding.service');
      const coords = await getCoordinates(
        this.location.state,
        this.location.city,
        this.location.pincode
      );

      this.location.latitude = coords.latitude;
      this.location.longitude = coords.longitude;

      console.log(
        `✅ Auto-geocoded ${this.organizationName}: ${coords.latitude}, ${coords.longitude}`
      );
    } catch (err) {
      console.warn(`⚠️ Geocoding skipped: ${err.message}`);
    }
  }
});


organizationSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

organizationSchema.methods.createVerificationToken = function () {
  const crypto = require('crypto');

  const token = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

  return token;
};

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
