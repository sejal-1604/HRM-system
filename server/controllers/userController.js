const User = require('../models/User');
const PrivateInfo = require('../models/PrivateInfo');
const SalaryInfo = require('../models/SalaryInfo');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.getAllEmployees(req.user.companyId);
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// In controllers/userController.js
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id; // Use param ID or authenticated user's ID
    
    // Your existing logic to fetch and return user profile
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check permissions
    if (req.user.role !== 'admin' && userId != req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await User.updateProfile(userId, req.body);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePrivateInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (req.user.role !== 'admin' && userId != req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await PrivateInfo.createOrUpdate(userId, req.body);
    res.json({ message: 'Private info updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateSalaryInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const { monthlyWage, workingDays, breakTime } = req.body;
    
    await SalaryInfo.createOrUpdate(userId, monthlyWage, workingDays, breakTime);
    res.json({ message: 'Salary info updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};