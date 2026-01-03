const Attendance = require('../models/Attendance');

exports.checkIn = async (req, res) => {
  try {
    await Attendance.checkIn(req.user.id);
    res.json({ message: 'Checked in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    await Attendance.checkOut(req.user.id);
    res.json({ message: 'Checked out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserAttendance = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const { startDate, endDate } = req.query;
    
    const attendance = await Attendance.getUserAttendance(userId, startDate, endDate);
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const attendance = await Attendance.getAllAttendance(req.user.companyId, date);
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};