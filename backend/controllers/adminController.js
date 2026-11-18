const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Article = require('../models/Article');
const MedicineReminder = require('../models/MedicineReminder');
const Notification = require('../models/Notification');

// @desc    Get system-wide platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const pendingVerifications = await Doctor.countDocuments({ isVerified: false });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const totalRecords = await MedicalRecord.countDocuments();
    const totalArticles = await Article.countDocuments();
    const activeReminders = await MedicineReminder.countDocuments({ status: 'active' });

    // Recent 5 registered users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPatients,
        totalDoctors,
        pendingVerifications,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        totalRecords,
        totalArticles,
        activeReminders,
        recentUsers,
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Inactive)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deactivating oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot deactivate their own account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      data: {
        _id: user._id,
        name: user.name,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctors for admin management
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
const getAllDoctorsAdmin = async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email phone avatar isActive createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or toggle verification of a doctor
// @route   PUT /api/admin/doctors/:id/verify
// @access  Private (Admin only)
const verifyDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    doctor.isVerified = !doctor.isVerified;
    await doctor.save();

    // Notify Doctor
    await Notification.create({
      user: doctor.user._id,
      title: doctor.isVerified ? 'Doctor Profile Verified ✅' : 'Verification Update ⚠️',
      message: doctor.isVerified
        ? 'Congratulations! Your medical credentials have been verified by the SehatSaathi administration.'
        : 'Your doctor verification status has been updated by the administrator.',
      type: 'system',
      link: '/doctor-dashboard',
    });

    res.status(200).json({
      success: true,
      message: `Doctor verification status updated to ${doctor.isVerified ? 'Verified' : 'Unverified'}`,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllDoctorsAdmin,
  verifyDoctor,
};
