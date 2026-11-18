const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllDoctorsAdmin,
  verifyDoctor,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/doctors', getAllDoctorsAdmin);
router.put('/doctors/:id/verify', verifyDoctor);

module.exports = router;
