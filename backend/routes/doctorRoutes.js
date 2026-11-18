const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorStats,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllDoctors);
router.get('/profile/me', protect, authorize('doctor'), getDoctorProfile);
router.put('/profile/me', protect, authorize('doctor'), updateDoctorProfile);
router.get('/dashboard/stats', protect, authorize('doctor'), getDoctorStats);
router.get('/:id', getDoctorById);

module.exports = router;
