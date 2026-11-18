const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const generateToken = require('../utils/generateToken');

// @desc    Register a new patient or doctor
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'patient',
      phone,
      gender,
      bloodGroup,
      dateOfBirth,
      // Doctor specific fields if registering as doctor
      specialization,
      qualification,
      experience,
      consultationFee,
      clinicName,
      clinicAddress,
      bio,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Role safety check: cannot self-register as admin
    const assignedRole = role === 'doctor' ? 'doctor' : 'patient';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      gender: gender || '',
      bloodGroup: bloodGroup || '',
      dateOfBirth: dateOfBirth || null,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0d9488`,
    });

    // If role is doctor, create the Doctor profile
    let doctorProfile = null;
    if (assignedRole === 'doctor') {
      doctorProfile = await Doctor.create({
        user: user._id,
        specialization: specialization || 'General Physician',
        qualification: qualification || 'MBBS',
        experience: experience ? Number(experience) : 2,
        consultationFee: consultationFee ? Number(consultationFee) : 500,
        clinicName: clinicName || 'SehatSaathi Care Clinic',
        clinicAddress: clinicAddress || 'City Healthcare Center',
        bio: bio || 'Dedicated medical professional striving for compassionate healthcare delivery.',
        isVerified: true, // auto-verified for easy college project demo
        status: 'active',
      });
    }

    // Welcome Notification
    await Notification.create({
      user: user._id,
      title: 'Welcome to SehatSaathi! 🎉',
      message: `Hello ${user.name}, welcome to SehatSaathi healthcare platform. Your account has been registered successfully.`,
      type: 'system',
      link: assignedRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        bloodGroup: user.bloodGroup,
        doctorProfile: doctorProfile || undefined,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    // If user is doctor, attach doctor profile
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        emergencyContact: user.emergencyContact,
        doctorProfile: doctorProfile || undefined,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let doctorProfile = null;

    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        doctorProfile: doctorProfile || undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      name,
      phone,
      gender,
      bloodGroup,
      dateOfBirth,
      address,
      emergencyContact,
      avatar,
    } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (avatar) user.avatar = avatar;

    if (address) {
      user.address = {
        street: address.street ?? user.address.street,
        city: address.city ?? user.address.city,
        state: address.state ?? user.address.state,
        postalCode: address.postalCode ?? user.address.postalCode,
      };
    }

    if (emergencyContact) {
      user.emergencyContact = {
        name: emergencyContact.name ?? user.emergencyContact.name,
        phone: emergencyContact.phone ?? user.emergencyContact.phone,
        relation: emergencyContact.relation ?? user.emergencyContact.relation,
      };
    }

    const updatedUser = await user.save();

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...updatedUser.toObject(),
        doctorProfile: doctorProfile || undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
