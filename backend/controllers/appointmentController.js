const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create / Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient / Admin)
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason, notes } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, appointmentDate, timeSlot, and reason',
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check if slot already booked with same doctor and time
    const appointmentDateObj = new Date(appointmentDate);
    const startOfDate = new Date(appointmentDateObj);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(appointmentDateObj);
    endOfDate.setHours(23, 59, 59, 999);

    const existingSlot = await Appointment.findOne({
      doctor: doctorId,
      timeSlot,
      appointmentDate: { $gte: startOfDate, $lte: endOfDate },
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: `The time slot '${timeSlot}' on ${appointmentDateObj.toLocaleDateString()} is already booked. Please choose another time slot.`,
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      timeSlot,
      reason,
      notes: notes || '',
      status: 'pending',
    });

    // Notify Doctor
    await Notification.create({
      user: doctor.user._id,
      title: 'New Appointment Booking Request 📅',
      message: `Patient ${req.user.name} has requested an appointment for ${appointmentDateObj.toLocaleDateString()} at ${timeSlot}.`,
      type: 'appointment',
      link: '/doctor-dashboard',
    });

    // Notify Patient
    await Notification.create({
      user: req.user._id,
      title: 'Appointment Booked Successfully 🩺',
      message: `Your appointment request with Dr. ${doctor.user.name} for ${appointmentDateObj.toLocaleDateString()} at ${timeSlot} is pending confirmation.`,
      type: 'appointment',
      link: '/patient-dashboard',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone avatar bloodGroup')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' },
      });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's appointments (Patient or Doctor)
// @route   GET /api/appointments
// @access  Private
const getMyAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor profile not found for user',
        });
      }
      query.doctor = doctor._id;
    } else if (req.user.role === 'admin') {
      // Admin can see all appointments or filter
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar bloodGroup gender dateOfBirth')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' },
      })
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone avatar bloodGroup gender dateOfBirth address')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Role check: patient, doctor or admin only
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctorUser =
      appointment.doctor &&
      appointment.doctor.user &&
      appointment.doctor.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctorUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Confirm, Complete, Cancel)
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, cancelledReason, prescriptionSummary } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email _id' },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctor =
      appointment.doctor &&
      appointment.doctor.user &&
      appointment.doctor.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
    }

    // Patient can only cancel
    if (isPatient && !['cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Patients can only cancel pending or confirmed appointments',
      });
    }

    // Update status
    if (status) {
      appointment.status = status;
    }

    if (status === 'cancelled') {
      appointment.cancelledReason = cancelledReason || 'Cancelled by user';
      appointment.cancelledBy = req.user.role;
    }

    if (prescriptionSummary) {
      appointment.prescriptionSummary = prescriptionSummary;
    }

    await appointment.save();

    // Trigger Notifications
    const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString();
    if (status === 'confirmed') {
      await Notification.create({
        user: appointment.patient._id,
        title: 'Appointment Confirmed! 🩺',
        message: `Your appointment with Dr. ${appointment.doctor.user.name} on ${formattedDate} at ${appointment.timeSlot} has been confirmed.`,
        type: 'appointment',
        link: '/patient-dashboard',
      });
    } else if (status === 'completed') {
      await Notification.create({
        user: appointment.patient._id,
        title: 'Appointment Completed ✅',
        message: `Your consultation with Dr. ${appointment.doctor.user.name} is marked completed. You can view doctor notes and summary.`,
        type: 'appointment',
        link: '/patient-dashboard',
      });
    } else if (status === 'cancelled') {
      const recipient = isPatient ? appointment.doctor.user._id : appointment.patient._id;
      const cancelledByName = req.user.name;
      await Notification.create({
        user: recipient,
        title: 'Appointment Cancelled ⚠️',
        message: `The appointment on ${formattedDate} at ${appointment.timeSlot} was cancelled by ${cancelledByName}. Reason: ${appointment.cancelledReason || 'No reason specified'}.`,
        type: 'appointment',
        link: isPatient ? '/doctor-dashboard' : '/patient-dashboard',
      });
    }

    const updated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone avatar bloodGroup')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' },
      });

    res.status(200).json({
      success: true,
      message: `Appointment status updated to '${status}' successfully`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};
