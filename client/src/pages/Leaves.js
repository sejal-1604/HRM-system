import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import './Leaves.css';

const Leaves = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = () => {
    // Mock leave requests - replace with real API call
    const mockRequests = [
      {
        id: 1,
        leaveType: 'annual',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Family vacation to visit parents in hometown',
        status: 'approved',
        appliedOn: '2024-01-10',
        approvedOn: '2024-01-11',
        approvedBy: 'John Manager',
        days: 3
      },
      {
        id: 2,
        leaveType: 'sick',
        startDate: '2024-01-05',
        endDate: '2024-01-05',
        reason: 'Medical appointment for routine checkup',
        status: 'approved',
        appliedOn: '2024-01-04',
        approvedOn: '2024-01-04',
        approvedBy: 'John Manager',
        days: 1
      },
      {
        id: 3,
        leaveType: 'personal',
        startDate: '2024-01-20',
        endDate: '2024-01-21',
        reason: 'Personal work - attending family function',
        status: 'pending',
        appliedOn: '2024-01-18',
        days: 2
      },
      {
        id: 4,
        leaveType: 'maternity',
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        reason: 'Maternity leave as per company policy',
        status: 'approved',
        appliedOn: '2023-12-15',
        approvedOn: '2023-12-16',
        approvedBy: 'HR Department',
        days: 91
      },
      {
        id: 5,
        leaveType: 'sick',
        startDate: '2023-12-20',
        endDate: '2023-12-22',
        reason: 'Recovery from minor surgery',
        status: 'rejected',
        appliedOn: '2023-12-19',
        rejectedOn: '2023-12-20',
        rejectedBy: 'John Manager',
        rejectionReason: 'Insufficient medical documentation',
        days: 3
      }
    ];
    setLeaveRequests(mockRequests);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate dates
      if (!formData.startDate || !formData.endDate) {
        setError('Please select both start and end dates');
        setLoading(false);
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('End date must be after start date');
        setLoading(false);
        return;
      }

      // Check for overlapping leave requests
      const hasOverlap = leaveRequests.some(request => 
        request.status === 'approved' &&
        ((new Date(formData.startDate) >= new Date(request.startDate) && new Date(formData.startDate) <= new Date(request.endDate)) ||
        (new Date(formData.endDate) >= new Date(request.startDate) && new Date(formData.endDate) <= new Date(request.endDate)) ||
        (new Date(formData.startDate) <= new Date(request.startDate) && new Date(formData.endDate) >= new Date(request.endDate)))
      );

      if (hasOverlap) {
        setError('You already have approved leave during this period');
        setLoading(false);
        return;
      }

      // Mock leave request - replace with real API call
      const days = calculateDays(formData.startDate, formData.endDate);
      const newRequest = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        appliedOn: new Date().toISOString().split('T')[0],
        days: days
      };

      setLeaveRequests([newRequest, ...leaveRequests]);
      setSuccess('Leave request submitted successfully! You will be notified once approved.');
      setFormData({ leaveType: 'annual', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculateLeaveBalance = () => {
    const currentYear = new Date().getFullYear();
    const annualLeaveEntitlement = 21; // Standard annual leave
    const approvedAnnualLeaves = leaveRequests
      .filter(r => r.status === 'approved' && r.leaveType === 'annual' && new Date(r.startDate).getFullYear() === currentYear)
      .reduce((sum, r) => sum + r.days, 0);
    
    const sickLeaveEntitlement = 10; // Standard sick leave
    const approvedSickLeaves = leaveRequests
      .filter(r => r.status === 'approved' && r.leaveType === 'sick' && new Date(r.startDate).getFullYear() === currentYear)
      .reduce((sum, r) => sum + r.days, 0);

    return {
      annual: annualLeaveEntitlement - approvedAnnualLeaves,
      sick: sickLeaveEntitlement - approvedSickLeaves,
      personal: 5, // Standard personal leave
      maternity: 180, // Standard maternity leave
      paternity: 15 // Standard paternity leave
    };
  };

  const getLeaveStats = () => {
    const currentYear = new Date().getFullYear();
    const yearRequests = leaveRequests.filter(r => new Date(r.startDate).getFullYear() === currentYear);
    
    return {
      total: yearRequests.length,
      approved: yearRequests.filter(r => r.status === 'approved').length,
      pending: yearRequests.filter(r => r.status === 'pending').length,
      rejected: yearRequests.filter(r => r.status === 'rejected').length,
      totalDays: yearRequests.reduce((sum, r) => sum + r.days, 0)
    };
  };

  const balance = calculateLeaveBalance();
  const stats = getLeaveStats();

  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case 'annual': return '🏖️';
      case 'sick': return '🤒';
      case 'personal': return '👤';
      case 'maternity': return '🤱';
      case 'paternity': return '👨‍👧‍👦';
      default: return '📋';
    }
  };

  const getLeaveTypeLabel = (type) => {
    switch (type) {
      case 'annual': return 'Annual Leave';
      case 'sick': return 'Sick Leave';
      case 'personal': return 'Personal Leave';
      case 'maternity': return 'Maternity Leave';
      case 'paternity': return 'Paternity Leave';
      default: type;
    }
  };

  return (
    <div className="leaves-page">
      <div className="leaves-container">
        <div className="leaves-header">
          <h1>Leave Management</h1>
          <p>Request and track your leave applications</p>
        </div>

        {/* Leave Balance Cards */}
        <div className="balance-grid">
          <div className="balance-card">
            <div className="balance-icon">🏖️</div>
            <div className="balance-content">
              <div className="balance-days">{balance.annual}</div>
              <div className="balance-label">Annual Leave</div>
              <div className="balance-detail">21 days total</div>
            </div>
          </div>
          <div className="balance-card">
            <div className="balance-icon">🤒</div>
            <div className="balance-content">
              <div className="balance-days">{balance.sick}</div>
              <div className="balance-label">Sick Leave</div>
              <div className="balance-detail">10 days total</div>
            </div>
          </div>
          <div className="balance-card">
            <div className="balance-icon">👤</div>
            <div className="balance-content">
              <div className="balance-days">{balance.personal}</div>
              <div className="balance-label">Personal Leave</div>
              <div className="balance-detail">5 days total</div>
            </div>
          </div>
          <div className="balance-card">
            <div className="balance-icon">📊</div>
            <div className="balance-content">
              <div className="balance-days">{stats.totalDays}</div>
              <div className="balance-label">Total Days Taken</div>
              <div className="balance-detail">This year</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">✗</div>
            <div className="stat-content">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        <div className="leave-content">
          {/* Leave Request Form */}
          <div className="leave-form-section">
            <h2>Request Leave</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-group">
                <label htmlFor="leaveType">Leave Type</label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                >
                  <option value="annual">🏖️ Annual Leave</option>
                  <option value="sick">🤒 Sick Leave</option>
                  <option value="personal">👤 Personal Leave</option>
                  <option value="maternity">🤱 Maternity Leave</option>
                  <option value="paternity">👨‍👧‍👦 Paternity Leave</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Please provide a detailed reason for your leave request..."
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? '⏳ Submitting...' : '📤 Submit Request'}
              </button>
            </form>
          </div>

          {/* Leave History */}
          <div className="leave-history-section">
            <div className="history-header">
              <h2>Leave History</h2>
              <div className="history-controls">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="year-selector"
                >
                  <option value={new Date().getFullYear()}>Current Year</option>
                  <option value={new Date().getFullYear() - 1}>Last Year</option>
                  <option value={new Date().getFullYear() - 2}>2 Years Ago</option>
                </select>
                <button 
                  className="view-toggle"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? '📋 List View' : '📅 Calendar View'}
                </button>
              </div>
            </div>
            
            {!showCalendar ? (
              <div className="leave-table">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Applied On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests
                        .filter(r => new Date(r.startDate).getFullYear() === selectedYear)
                        .map((request) => (
                        <tr key={request.id}>
                          <td className="leave-type">
                            <span className="type-icon">{getLeaveTypeIcon(request.leaveType)}</span>
                            {getLeaveTypeLabel(request.leaveType)}
                          </td>
                          <td>{request.startDate}</td>
                          <td>{request.endDate}</td>
                          <td className="days-count">{request.days}</td>
                          <td className="reason">{request.reason}</td>
                          <td>
                            <span className={`status ${getStatusClass(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td>{request.appliedOn}</td>
                          <td>
                            {request.status === 'pending' && (
                              <button className="btn-withdraw">Withdraw</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="calendar-view">
                <div className="calendar-header">
                  <h3>{selectedYear} Leave Calendar</h3>
                  <div className="calendar-nav">
                    <button onClick={() => setSelectedYear(selectedYear - 1)}>←</button>
                    <button onClick={() => setSelectedYear(new Date().getFullYear())}>Current</button>
                    <button onClick={() => setSelectedYear(selectedYear + 1)}>→</button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                    <div key={month} className="month-view">
                      <h4>{month}</h4>
                      <div className="month-days">
                        {Array.from({ length: 31 }, (_, i) => {
                          const date = new Date(selectedYear, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month), i + 1);
                          const dateStr = date.toISOString().split('T')[0];
                          const leave = leaveRequests.find(r => 
                            new Date(r.startDate) <= date && date <= new Date(r.endDate) && r.status === 'approved'
                          );
                          
                          return (
                            <div 
                              key={i} 
                              className={`calendar-day ${leave ? 'leave-day' : ''} ${date.toDateString() === new Date().toDateString() ? 'today' : ''}`}
                            >
                              <div className="date-number">{i + 1}</div>
                              {leave && (
                                <div className="leave-indicator" title={`${getLeaveTypeLabel(leave.leaveType)} - ${leave.reason}`}>
                                  {getLeaveTypeIcon(leave.leaveType)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaves;