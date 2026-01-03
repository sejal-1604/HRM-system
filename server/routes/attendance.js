const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/checkin', auth, attendanceController.checkIn);
router.post('/checkout', auth, attendanceController.checkOut);
router.get('/user/:id', auth, attendanceController.getUserAttendance);
router.get('/user', auth, attendanceController.getUserAttendance);
router.get('/all', auth, isAdmin, attendanceController.getAllAttendance);

module.exports = router;
