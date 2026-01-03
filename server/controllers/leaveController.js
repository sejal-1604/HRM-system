const LeaveRequest = require('../models/LeaveRequest');

exports.createLeaveRequest = async (req, res) => {
  try {
    const requestId = await LeaveRequest.create(req.user.id, req.body);
    res.status(201).json({ message: 'Leave request created', requestId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.getUserRequests(req.user.id);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.getAllRequests(req.user.companyId);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminComments } = req.body;
    
    await LeaveRequest.updateStatus(requestId, status, adminComments);
    res.json({ message: 'Leave request updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};