const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/', auth, leaveController.createLeaveRequest);
router.get('/my-requests', auth, leaveController.getUserRequests);
router.get('/all', auth, isAdmin, leaveController.getAllRequests);
router.put('/:requestId', auth, isAdmin, leaveController.updateRequestStatus);

module.exports = router;