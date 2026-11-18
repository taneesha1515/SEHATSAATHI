const mongoose = require('mongoose');

const medicineReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reminder must belong to a user'],
    },
    medicineName: {
      type: String,
      required: [true, 'Please provide medicine name'],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, 'Please provide dosage (e.g. 500mg - 1 tablet)'],
      trim: true,
    },
    frequency: {
      type: String,
      required: [true, 'Please select frequency'],
      default: 'Once Daily',
    },
    times: {
      type: [String],
      required: [true, 'Please specify reminder time(s)'],
      default: ['09:00 AM'],
    },
    instructions: {
      type: String,
      default: 'Take after meals with water',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    logs: [
      {
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: { type: String, enum: ['taken', 'missed', 'snoozed'], default: 'taken' },
        loggedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicineReminder', medicineReminderSchema);
