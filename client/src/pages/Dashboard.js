import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [myPayroll, setMyPayroll] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: ''
  });
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [presentToday, setPresentToday] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    } else {
      loadEmployeeData();
    }
  }, [user]);

  const generateLoginId = (firstName, lastName, year, serial) => {
    const companyPrefix = 'OI'; // Odoo India
    const namePrefix = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
    const serialStr = serial.toString().padStart(4, '0');
    return `${companyPrefix}${namePrefix}${year}${serialStr}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const getSerialNumber = (year) => {
    const yearEmployees = employees.filter(emp => {
      if (emp.joiningYear) {
        return emp.joiningYear === year;
      }
      return false;
    });
    return yearEmployees.length + 1;
  };

  const handleCreateEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      alert('Please fill all required fields');
      return;
    }

    const currentYear = new Date().getFullYear().toString();
    const serialNumber = getSerialNumber(currentYear);
    const loginId = generateLoginId(newEmployee.firstName, newEmployee.lastName, currentYear, serialNumber);
    const password = generatePassword();

    const credentials = {
      loginId,
      password,
      email: newEmployee.email,
      name: `${newEmployee.firstName} ${newEmployee.lastName}`,
      department: newEmployee.department,
      position: newEmployee.position
    };

    setGeneratedCredentials(credentials);
    
    const employee = {
      id: employees.length + 1,
      name: credentials.name,
      email: credentials.email,
      department: credentials.department,
      position: credentials.position,
      loginId: credentials.loginId,
      joiningYear: currentYear,
      status: 'active',
      profile_picture: null
    };
    
    setEmployees([...employees, employee]);
    setShowCreateForm(false);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: ''
    });
  };

  const sendEmailCredentials = (credentials) => {
    const subject = 'Your Login Credentials - DayFlow HRMS';
    const body = `Dear ${credentials.name},

Your account has been created in DayFlow HRMS.

Login ID: ${credentials.loginId}
Password: ${credentials.password}
Email: ${credentials.email}

Please use these credentials to login to the system.

Best regards,
HR Team`;

    window.location.href = `mailto:${credentials.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };

  const handleCheckIn = () => {
    const now = new Date();
    const attendance = {
      id: myAttendance.length + 1,
      date: now.toLocaleDateString(),
      checkIn: now.toLocaleTimeString(),
      checkOut: null,
      status: 'present'
    };
    setMyAttendance([attendance, ...myAttendance]);
    setIsOnline(true);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setMyAttendance(prev => 
      prev.map(att => 
        att.id === 1 ? { ...att, checkOut: now.toLocaleTimeString() } : att
      )
    );
    setIsOnline(false);
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEmployees = [
        { 
          id: 1, 
          name: 'John Doe', 
          email: 'john@company.com', 
          department: 'Engineering', 
          status: 'active',
          loginId: 'OIJO20220001',
          joiningYear: '2022',
          profile_picture: null
        },
        { 
          id: 2, 
          name: 'Jane Smith', 
          email: 'jane@company.com', 
          department: 'HR', 
          status: 'active',
          loginId: 'OIJA20220002',
          joiningYear: '2022',
          profile_picture: null
        },
        { 
          id: 3, 
          name: 'Bob Johnson', 
          email: 'bob@company.com', 
          department: 'Marketing', 
          status: 'active',
          loginId: 'OIBJ20220003',
          joiningYear: '2022',
          profile_picture: null
        }
      ];
      
      const mockAttendance = [
        { id: 1, employee: 'John Doe', date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', status: 'present' },
        { id: 2, employee: 'Jane Smith', date: '2024-01-15', checkIn: '08:45', checkOut: '17:30', status: 'present' },
        { id: 3, employee: 'Bob Johnson', date: '2024-01-15', checkIn: '09:15', checkOut: null, status: 'present' }
      ];
      
      const mockLeaves = [
        { id: 1, employee: 'John Doe', type: 'sick', startDate: '2024-01-20', endDate: '2024-01-21', status: 'pending' },
        { id: 2, employee: 'Jane Smith', type: 'annual', startDate: '2024-01-25', endDate: '2024-01-27', status: 'approved' }
      ];
      
      const mockPayroll = [
        { id: 1, employee: 'John Doe', basic: 5000, allowances: 1000, deductions: 500, net: 5500, month: 'January 2024' },
        { id: 2, employee: 'Jane Smith', basic: 4500, allowances: 800, deductions: 400, net: 4900, month: 'January 2024' }
      ];

      setEmployees(mockEmployees);
      setAttendanceData(mockAttendance);
      setLeaveRequests(mockLeaves);
      setPayrollData(mockPayroll);
      setPresentToday(mockAttendance.filter(a => a.status === 'present').length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockMyAttendance = [
        { id: 1, date: '2024-01-15', checkIn: '09:00', checkOut: null, status: 'present' },
        { id: 2, date: '2024-01-14', checkIn: '08:45', checkOut: '17:30', status: 'present' },
        { id: 3, date: '2024-01-13', checkIn: null, checkOut: null, status: 'absent' }
      ];
      
      const mockMyLeaves = [
        { id: 1, type: 'sick', startDate: '2024-01-20', endDate: '2024-01-21', status: 'pending' },
        { id: 2, type: 'annual', startDate: '2023-12-25', endDate: '2023-12-27', status: 'approved' }
      ];
      
      const mockMyPayroll = {
        basic: 5000,
        allowances: 1000,
        deductions: 500,
        net: 5500,
        month: 'January 2024'
      };

      setMyAttendance(mockMyAttendance);
      setMyLeaves(mockMyLeaves);
      setMyPayroll(mockMyPayroll);
      setIsOnline(mockMyAttendance[0].checkOut === null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = (leaveId) => {
    setLeaveRequests(prev => 
      prev.map(leave => 
        leave.id === leaveId ? { ...leave, status: 'approved' } : leave
      )
    );
  };

  const handleRejectLeave = (leaveId) => {
    setLeaveRequests(prev => 
      prev.map(leave => 
        leave.id === leaveId ? { ...leave, status: 'rejected' } : leave
      )
    );
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-skeleton">
          <div className="skeleton-card shimmer"></div>
          <div className="skeleton-card shimmer"></div>
          <div className="skeleton-card shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {user?.role === 'admin' ? (
        <div className="admin-dashboard">
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Employees</h3>
                <div className="stat-number">{employees.length}</div>
              </div>
              <div className="stat-card">
                <h3>Present Today</h3>
                <div className="stat-number">{presentToday}</div>
              </div>
              <div className="stat-card">
                <h3>Pending Leaves</h3>
                <div className="stat-number">{leaveRequests.filter(l => l.status === 'pending').length}</div>
              </div>
              <div className="stat-card">
                <h3>Check In/Out</h3>
                <button 
                  onClick={isOnline ? handleCheckOut : handleCheckIn}
                  className={`btn-check ${isOnline ? 'check-out' : 'check-in'}`}
                >
                  {isOnline ? 'CHECK OUT' : 'CHECK IN'}
                </button>
              </div>
            </div>

            <div className="content-grid">
              <div className="content-section">
                <h2>Employees</h2>
                <div className="employee-list">
                  {employees.map(emp => (
                    <div key={emp.id} className="employee-item">
                      <div className="employee-info">
                        <img src={emp.profile_picture || 'https://via.placeholder.com/40'} alt={emp.name} className="employee-avatar" />
                        <div>
                          <div className="employee-name">{emp.name}</div>
                          <div className="employee-details">{emp.department} • {emp.position}</div>
                        </div>
                      </div>
                      <div className="employee-actions">
                        <span className="login-id">{emp.loginId}</span>
                        <button onClick={() => navigate(`/profile/${emp.id}`)} className="btn-view">View</button>
                        <button onClick={() => handleDeleteEmployee(emp.id)} className="btn-delete">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-section">
                <h2>Today's Attendance</h2>
                <div className="attendance-list">
                  {attendanceData.map(att => (
                    <div key={att.id} className="attendance-item">
                      <span>{att.employee}</span>
                      <span>{att.checkIn} - {att.checkOut || 'Working'}</span>
                      <span className={`status ${att.status}`}>{att.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-section">
                <h2>New Leave Requests</h2>
                <div className="leave-list">
                  {leaveRequests.filter(l => l.status === 'pending').map(leave => (
                    <div key={leave.id} className="leave-item">
                      <div className="leave-info">
                        <span>{leave.employee}</span>
                        <span>{leave.type} ({leave.startDate} - {leave.endDate})</span>
                      </div>
                      <div className="leave-actions">
                        <button onClick={() => handleApproveLeave(leave.id)} className="btn-approve">Approve</button>
                        <button onClick={() => handleRejectLeave(leave.id)} className="btn-reject">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-section">
                <h2>Payroll Overview</h2>
                <div className="payroll-list">
                  {payrollData.map(payroll => (
                    <div key={payroll.id} className="payroll-item">
                      <span>{payroll.employee}</span>
                      <span>{payroll.month}</span>
                      <span className="salary">${payroll.net}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="employee-dashboard">
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>My Attendance</h3>
                <div className="stat-number">{myAttendance.filter(a => a.status === 'present').length}/{myAttendance.length}</div>
              </div>
              <div className="stat-card">
                <h3>My Leaves</h3>
                <div className="stat-number">{myLeaves.filter(l => l.status === 'approved').length}</div>
              </div>
              <div className="stat-card">
                <h3>Monthly Salary</h3>
                <div className="stat-number">${myPayroll.net}</div>
              </div>
              <div className="stat-card">
                <h3>Current Status</h3>
                <div className="stat-number">{isOnline ? 'Working' : 'Offline'}</div>
              </div>
            </div>

            <div className="content-grid">
              <div className="content-section">
                <h2>My Profile</h2>
                <div className="profile-summary">
                  <div className="profile-header">
                    <img src="https://via.placeholder.com/80" alt="Profile" className="profile-avatar" />
                    <div>
                      <h3>{user?.name}</h3>
                      <p>{user?.email}</p>
                      <p>{user?.role}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/profile')} className="btn-view">View Full Profile</button>
                </div>
              </div>

              <div className="content-section">
                <h2>My Attendance</h2>
                <div className="attendance-list">
                  {myAttendance.slice(0, 5).map(att => (
                    <div key={att.id} className="attendance-item">
                      <span>{att.date}</span>
                      <span>{att.checkIn || 'N/A'} - {att.checkOut || 'Working'}</span>
                      <span className={`status ${att.status}`}>{att.status}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/attendance')} className="btn-view">View All Attendance</button>
              </div>

              <div className="content-section">
                <h2>My Leave Requests</h2>
                <div className="leave-list">
                  {myLeaves.map(leave => (
                    <div key={leave.id} className="leave-item">
                      <span>{leave.type} ({leave.startDate} - {leave.endDate})</span>
                      <span className={`status ${leave.status}`}>{leave.status}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/leaves')} className="btn-view">Apply for Leave</button>
              </div>

              <div className="content-section">
                <h2>My Payroll</h2>
                <div className="payroll-summary">
                  <p><strong>Month:</strong> {myPayroll.month}</p>
                  <p><strong>Basic Salary:</strong> ${myPayroll.basic}</p>
                  <p><strong>Allowances:</strong> ${myPayroll.allowances}</p>
                  <p><strong>Deductions:</strong> ${myPayroll.deductions}</p>
                  <p><strong>Net Salary:</strong> <strong>${myPayroll.net}</strong></p>
                </div>
              </div>

              <div className="content-section">
                <h2>Company Employees</h2>
                <div className="employee-list">
                  {employees.map(emp => (
                    <div key={emp.id} className="employee-item">
                      <div className="employee-info">
                        <img src={emp.profile_picture || 'https://via.placeholder.com/40'} alt={emp.name} className="employee-avatar" />
                        <div>
                          <div className="employee-name">{emp.name}</div>
                          <div className="employee-details">{emp.department} • {emp.position}</div>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/profile/${emp.id}`)} className="btn-view">View Profile</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;