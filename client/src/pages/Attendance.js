import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import './Attendance.css';

const Attendance = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadTodayAttendance();
    loadAttendanceHistory();

    return () => clearInterval(timer);
  }, []);

  const loadTodayAttendance = () => {
    // Mock today's attendance - replace with real API call
    const mockToday = {
      date: new Date().toLocaleDateString(),
      checkIn: null,
      checkOut: null,
      status: 'not_checked_in',
      workingHours: 0
    };
    setTodayAttendance(mockToday);
  };

  const loadAttendanceHistory = () => {
    // Mock attendance history - replace with real API call
    const mockHistory = [
      { date: '2024-01-15', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'present', workingHours: 9 },
      { date: '2024-01-14', checkIn: '08:45 AM', checkOut: '05:45 PM', status: 'present', workingHours: 9 },
      { date: '2024-01-13', checkIn: null, checkOut: null, status: 'absent', workingHours: 0 },
      { date: '2024-01-12', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'present', workingHours: 9.25 },
      { date: '2024-01-11', checkIn: '08:30 AM', checkOut: '05:30 PM', status: 'present', workingHours: 9 },
      { date: '2024-01-10', checkIn: '09:30 AM', checkOut: '06:45 PM', status: 'present', workingHours: 9.25 },
      { date: '2024-01-09', checkIn: null, checkOut: null, status: 'leave', workingHours: 0 },
      { date: '2024-01-08', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'present', workingHours: 9 },
      { date: '2024-01-05', checkIn: '08:45 AM', checkOut: '05:15 PM', status: 'half_day', workingHours: 4.5 },
      { date: '2024-01-04', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'present', workingHours: 9 },
    ];
    setAttendanceHistory(mockHistory);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      // Mock check-in - replace with real API call
      const checkInTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = {
        ...todayAttendance,
        checkIn: checkInTime,
        status: 'checked_in'
      };
      setTodayAttendance(updated);
      
      // Update history with today's record
      setAttendanceHistory([{
        date: new Date().toLocaleDateString(),
        checkIn: checkInTime,
        checkOut: null,
        status: 'present',
        workingHours: 0
      }, ...attendanceHistory]);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      // Mock check-out - replace with real API call
      const checkOutTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = {
        ...todayAttendance,
        checkOut: checkOutTime,
        status: 'checked_out'
      };
      setTodayAttendance(updated);
      
      // Calculate working hours
      const checkInHour = parseInt(todayAttendance.checkIn.split(':')[0]);
      const checkInMin = parseInt(todayAttendance.checkIn.split(':')[1].split(' ')[0]);
      const checkOutHour = parseInt(checkOutTime.split(':')[0]);
      const checkOutMin = parseInt(checkOutTime.split(':')[1].split(' ')[0]);
      
      let workingHours = (checkOutHour + checkOutMin/60) - (checkInHour + checkInMin/60);
      if (workingHours < 0) workingHours += 12; // Handle PM/AM
      
      // Update today's record in history
      setAttendanceHistory(history => 
        history.map(record => 
          record.date === new Date().toLocaleDateString()
            ? { ...record, checkOut: checkOutTime, workingHours: workingHours.toFixed(2) }
            : record
        )
      );
    } catch (error) {
      console.error('Check-out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalDays = attendanceHistory.length;
    const presentDays = attendanceHistory.filter(d => d.status === 'present').length;
    const absentDays = attendanceHistory.filter(d => d.status === 'absent').length;
    const leaveDays = attendanceHistory.filter(d => d.status === 'leave').length;
    const halfDays = attendanceHistory.filter(d => d.status === 'half_day').length;
    const totalHours = attendanceHistory.reduce((sum, d) => sum + parseFloat(d.workingHours || 0), 0);
    const avgHours = totalDays > 0 ? (totalHours / totalDays).toFixed(1) : 0;

    return {
      totalDays,
      presentDays,
      absentDays,
      leaveDays,
      halfDays,
      totalHours,
      avgHours,
      attendanceRate: totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <div className="attendance-header">
          <h1>Attendance Management</h1>
          <p>Track your daily attendance and working hours</p>
        </div>

        {/* Current Time Card */}
        <div className="time-card">
          <div className="time-display">
            <div className="current-time">{currentTime.toLocaleTimeString()}</div>
            <div className="current-date">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="attendance-actions">
            {todayAttendance?.status === 'not_checked_in' && (
              <button 
                onClick={handleCheckIn} 
                disabled={loading}
                className="btn-check-in"
              >
                {loading ? 'Processing...' : '👆 Check In'}
              </button>
            )}
            
            {todayAttendance?.status === 'checked_in' && (
              <button 
                onClick={handleCheckOut} 
                disabled={loading}
                className="btn-check-out"
              >
                {loading ? 'Processing...' : '👋 Check Out'}
              </button>
            )}
            
            {todayAttendance?.status === 'checked_out' && (
              <div className="completed-message">
                <div className="check-icon">✓</div>
                <p>Already checked out for today</p>
                <small>See you tomorrow!</small>
              </div>
            )}
          </div>
        </div>

        {/* Today's Summary */}
        {todayAttendance && (
          <div className="today-summary-card">
            <h3>Today's Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Check In:</span>
                <span className="value">{todayAttendance.checkIn || 'Not checked in'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Check Out:</span>
                <span className="value">{todayAttendance.checkOut || 'Not checked out'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Status:</span>
                <span className={`status ${todayAttendance.status}`}>
                  {todayAttendance.status.replace('_', ' ').replace('checked in', 'Working').replace('checked out', 'Completed')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalDays}</div>
              <div className="stat-label">Total Days</div>
            </div>
          </div>
          <div className="stat-card present">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-number">{stats.presentDays}</div>
              <div className="stat-label">Present</div>
            </div>
          </div>
          <div className="stat-card absent">
            <div className="stat-icon">✗</div>
            <div className="stat-content">
              <div className="stat-number">{stats.absentDays}</div>
              <div className="stat-label">Absent</div>
            </div>
          </div>
          <div className="stat-card leave">
            <div className="stat-icon">🏖️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.leaveDays}</div>
              <div className="stat-label">On Leave</div>
            </div>
          </div>
          <div className="stat-card hours">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-number">{stats.avgHours}h</div>
              <div className="stat-label">Avg Hours</div>
            </div>
          </div>
          <div className="stat-card rate">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.attendanceRate}%</div>
              <div className="stat-label">Attendance Rate</div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="attendance-history">
          <div className="history-header">
            <h2>Attendance History</h2>
            <button 
              className="view-toggle"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {showCalendar ? '📋 Table View' : '📅 Calendar View'}
            </button>
          </div>
          
          {!showCalendar ? (
            <div className="history-table">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Working Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((record, index) => (
                      <tr key={index}>
                        <td>{record.date}</td>
                        <td>{record.checkIn || '-'}</td>
                        <td>{record.checkOut || '-'}</td>
                        <td>{record.workingHours ? `${record.workingHours}h` : '-'}</td>
                        <td>
                          <span className={`status ${record.status}`}>
                            {record.status.replace('_', ' ')}
                          </span>
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
                <h3>{selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <div className="calendar-nav">
                  <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}>
                    ←
                  </button>
                  <button onClick={() => setSelectedMonth(new Date())}>Today</button>
                  <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}>
                    →
                  </button>
                </div>
              </div>
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i - new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay() + 1);
                  const dateStr = date.toLocaleDateString();
                  const attendance = attendanceHistory.find(a => a.date === dateStr);
                  const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div 
                      key={i} 
                      className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                    >
                      <div className="date-number">{date.getDate()}</div>
                      {attendance && (
                        <div className={`attendance-indicator ${attendance.status}`}>
                          {attendance.status === 'present' && '✓'}
                          {attendance.status === 'absent' && '✗'}
                          {attendance.status === 'leave' && '🏖️'}
                          {attendance.status === 'half_day' && '½'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;