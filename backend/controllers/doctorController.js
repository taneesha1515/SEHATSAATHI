const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all active doctors with search & filters
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res, next) => {
  try {
    const {
      search,
      specialization,
      maxFee,
      minRating,
      availableDay,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { status: 'active', isVerified: true };

    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: new RegExp(specialization, 'i') };
    }

    if (maxFee) {
      query.consultationFee = { $lte: Number(maxFee) };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (availableDay && availableDay !== 'All') {
      query.availableDays = availableDay;
    }

    // Populate user details
    let doctors = await Doctor.find(query)
      .populate('user', 'name email phone avatar')
      .sort({ rating: -1, experience: -1 });

    // Filter by doctor name if search query is passed
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      doctors = doctors.filter(
        (doc) =>
          doc.user &&
          (searchRegex.test(doc.user.name) ||
            searchRegex.test(doc.specialization) ||
            searchRegex.test(doc.clinicName) ||
            searchRegex.test(doc.clinicAddress))
      );
    }

    // Pagination
    const total = doctors.length;
    const startIndex = (page - 1) * limit;
    const paginatedDoctors = doctors.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      count: paginatedDoctors.length,
      total,
      data: paginatedDoctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'user',
      'name email phone avatar address'
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in doctor's profile
// @route   GET /api/doctors/profile/me
// @access  Private (Doctor only)
const getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone avatar bloodGroup gender address'
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile/me
// @access  Private (Doctor only)
const updateDoctorProfile = async (req, res, next) => {
  try {
    let doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      bio,
      clinicName,
      clinicAddress,
      availableDays,
      availableTimeSlots,
    } = req.body;

    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = Number(experience);
    if (consultationFee !== undefined) doctor.consultationFee = Number(consultationFee);
    if (bio) doctor.bio = bio;
    if (clinicName) doctor.clinicName = clinicName;
    if (clinicAddress) doctor.clinicAddress = clinicAddress;
    if (availableDays) doctor.availableDays = availableDays;
    if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;

    const updatedDoctor = await doctor.save();
    const populated = await Doctor.findById(updatedDoctor._id).populate('user', 'name email phone avatar');

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor dashboard stats
// @route   GET /api/doctors/dashboard/stats
// @access  Private (Doctor only)
const getDoctorStats = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const doctorId = doctor._id;

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });
    const pendingAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: 'pending',
    });
    const confirmedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: 'confirmed',
    });
    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: 'completed',
    });

    // Today's appointments
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // Unique patients treated
    const uniquePatients = await Appointment.distinct('patient', { doctor: doctorId });

    // Recent 5 appointments
    const recentAppointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email phone avatar gender bloodGroup')
      .sort({ appointmentDate: -1, createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        todayAppointments,
        totalPatients: uniquePatients.length,
        rating: doctor.rating,
        reviewsCount: doctor.reviewsCount,
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorStats,
};
