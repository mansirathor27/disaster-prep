
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema(
  {
    
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
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

    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },

    classTeacher: {
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

    qualification: String,
    experience: Number,
    phone: {
      type: String,
      trim: true,
    },

    dateOfJoining: {
      type: Date,
      default: Date.now,
    },

    profilePicture: String,
    bio: String,

    emailVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpires: Date,

    isActive: {
      type: Boolean,
      default: true,
    },    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teacherSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'classTeacher',
});

teacherSchema.index({
  organization: 1,
  'classTeacher.grade': 1,
  'classTeacher.section': 1,
});


teacherSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});


teacherSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

teacherSchema.methods.createVerificationToken = function () {
  const crypto = require('crypto');

  const token = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

  return token;
};

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
