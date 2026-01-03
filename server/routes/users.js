const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/employees', auth, isAdmin, userController.getAllEmployees);
router.get('/profile/:id', auth, userController.getProfile); 
router.get('/profile', auth, userController.getProfile);
router.put('/profile/:id', auth, userController.updateProfile);
router.put('/private-info/:id', auth, userController.updatePrivateInfo);
router.put('/salary-info/:id', auth, isAdmin, userController.updateSalaryInfo);

module.exports = router;