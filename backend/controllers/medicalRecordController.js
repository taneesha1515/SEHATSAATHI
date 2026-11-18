const MedicalRecord = require('../models/MedicalRecord');
const Doctor = require('../models/Doctor');

// @desc    Get medical records for current user (or patient records if doctor)
// @route   GET /api/records
// @access  Private
const getMyRecords = async (req, res, next) => {
  try {
    const { type, patientId } = req.query;
    let query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      if (patientId) {
        query.patient = patientId;
      } else {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (doctor) {
          query = {
            $or: [{ doctor: doctor._id }, { doctorName: { $regex: req.user.name, $options: 'i' } }],
          };
        }
      }
    } else if (req.user.role === 'admin') {
      if (patientId) query.patient = patientId;
    }

    if (type && type !== 'All') {
      query.recordType = type.toLowerCase();
    }

    const records = await MedicalRecord.find(query)
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ recordDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single medical record
// @route   GET /api/records/:id
// @access  Private
const getRecordById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name email phone avatar bloodGroup')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' },
      });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
      });
    }

    // Role check
    const isPatient = record.patient._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor';

    if (!isPatient && !isAdmin && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this record',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res, next) => {
  try {
    const {
      title,
      recordType,
      recordDate,
      diagnosis,
      description,
      doctorName,
      fileUrl,
      fileName,
      tags,
      patientId, // if doctor creating on behalf of a patient
    } = req.body;

    if (!title || !recordType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and recordType',
      });
    }

    let targetPatientId = req.user._id;
    let doctorId = null;
    let clinicianName = doctorName || 'Self / Personal Record';

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) doctorId = doctor._id;
      clinicianName = `Dr. ${req.user.name}`;
      if (patientId) {
        targetPatientId = patientId;
      }
    }

    const newRecord = await MedicalRecord.create({
      patient: targetPatientId,
      doctor: doctorId,
      doctorName: clinicianName,
      title,
      recordType,
      recordDate: recordDate ? new Date(recordDate) : Date.now(),
      diagnosis: diagnosis || '',
      description: description || '',
      fileUrl: fileUrl || '',
      fileName: fileName || '',
      tags: tags || [],
    });

    const populated = await MedicalRecord.findById(newRecord._id).populate(
      'patient',
      'name email'
    );

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a medical record
// @route   PUT /api/records/:id
// @access  Private
const updateRecord = async (req, res, next) => {
  try {
    let record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
      });
    }

    const isPatient = record.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor';

    if (!isPatient && !isAdmin && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this record',
      });
    }

    const { title, recordType, recordDate, diagnosis, description, doctorName, tags } =
      req.body;

    if (title) record.title = title;
    if (recordType) record.recordType = recordType;
    if (recordDate) record.recordDate = new Date(recordDate);
    if (diagnosis !== undefined) record.diagnosis = diagnosis;
    if (description !== undefined) record.description = description;
    if (doctorName !== undefined) record.doctorName = doctorName;
    if (tags) record.tags = tags;

    const updated = await record.save();

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a medical record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
      });
    }

    const isPatient = record.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this record',
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
