const express = require('express');
const router = express.Router();
const {
  getMyRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/medicalRecordController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMyRecords)
  .post(createRecord);

router.route('/:id')
  .get(getRecordById)
  .put(updateRecord)
  .delete(deleteRecord);

module.exports = router;
