const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must have a patient'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Appointment must have a doctor'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide appointment date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select an appointment time slot'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Please mention reason or chief complaint for consultation'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      default: '',
    },
    prescriptionSummary: {
      type: String,
      default: '',
    },
    cancelledReason: {
      type: String,
      default: '',
    },
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', ''],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
