const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Record must be associated with a patient'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    doctorName: {
      type: String,
      default: 'Self Uploaded / External Clinician',
    },
    title: {
      type: String,
      required: [true, 'Please provide record title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    recordType: {
      type: String,
      enum: ['prescription', 'lab_report', 'scan', 'doctor_note', 'discharge_summary'],
      required: [true, 'Please specify record type'],
    },
    recordDate: {
      type: Date,
      default: Date.now,
    },
    diagnosis: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
