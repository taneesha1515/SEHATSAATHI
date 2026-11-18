const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide doctor specialization'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide educational qualifications (e.g. MBBS, MD)'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative'],
      default: 1,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: [0, 'Consultation fee cannot be negative'],
      default: 500,
    },
    bio: {
      type: String,
      default: 'Dedicated healthcare professional committed to patient-centered care and well-being.',
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    clinicName: {
      type: String,
      default: 'SehatSaathi Care Clinic',
    },
    clinicAddress: {
      type: String,
      default: 'Main Medical Center, City Hospital Road',
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    availableTimeSlots: {
      type: [String],
      default: [
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
      ],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 15,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
