const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createAppointment)
  .get(getMyAppointments);

router.route('/:id')
  .get(getAppointmentById);

router.put('/:id/status', updateAppointmentStatus);

module.exports = router;
