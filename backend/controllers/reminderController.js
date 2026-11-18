const MedicineReminder = require('../models/MedicineReminder');
const Notification = require('../models/Notification');

// @desc    Get all medicine reminders for logged-in user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    const reminders = await MedicineReminder.find(query).sort({
      status: 1, // 'active' first
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new medicine reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res, next) => {
  try {
    const {
      medicineName,
      dosage,
      frequency,
      times,
      instructions,
      startDate,
      endDate,
    } = req.body;

    if (!medicineName || !dosage || !times || times.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide medicineName, dosage, and at least one time slot',
      });
    }

    const reminder = await MedicineReminder.create({
      user: req.user._id,
      medicineName,
      dosage,
      frequency: frequency || 'Once Daily',
      times: Array.isArray(times) ? times : [times],
      instructions: instructions || 'Take with water after meals',
      startDate: startDate ? new Date(startDate) : Date.now(),
      endDate: endDate ? new Date(endDate) : null,
      status: 'active',
    });

    // Create system notification
    await Notification.create({
      user: req.user._id,
      title: 'Medicine Reminder Scheduled 💊',
      message: `Reminder active for ${medicineName} (${dosage}) at ${reminder.times.join(', ')}.`,
      type: 'reminder',
      link: '/reminders',
    });

    res.status(201).json({
      success: true,
      message: 'Medicine reminder set successfully',
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a medicine reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res, next) => {
  try {
    let reminder = await MedicineReminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found or unauthorized',
      });
    }

    const {
      medicineName,
      dosage,
      frequency,
      times,
      instructions,
      startDate,
      endDate,
      status,
    } = req.body;

    if (medicineName) reminder.medicineName = medicineName;
    if (dosage) reminder.dosage = dosage;
    if (frequency) reminder.frequency = frequency;
    if (times) reminder.times = Array.isArray(times) ? times : [times];
    if (instructions !== undefined) reminder.instructions = instructions;
    if (startDate) reminder.startDate = new Date(startDate);
    if (endDate !== undefined) reminder.endDate = endDate ? new Date(endDate) : null;
    if (status) reminder.status = status;

    const updated = await reminder.save();

    res.status(200).json({
      success: true,
      message: 'Reminder updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a medicine reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await MedicineReminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medicine reminder removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log medicine taken or missed
// @route   POST /api/reminders/:id/log
// @access  Private
const logMedicineIntake = async (req, res, next) => {
  try {
    const { time, status = 'taken' } = req.body;
    const reminder = await MedicineReminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Remove any existing log for the exact same date & time
    reminder.logs = reminder.logs.filter(
      (log) => !(log.date === todayStr && log.time === time)
    );

    // Push new log entry
    reminder.logs.push({
      date: todayStr,
      time: time || reminder.times[0] || '12:00 PM',
      status,
      loggedAt: new Date(),
    });

    await reminder.save();

    res.status(200).json({
      success: true,
      message: `Marked dosage for ${time || 'today'} as ${status}`,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  logMedicineIntake,
};
