const db = require('../config/db');

class Attendance {
  
  static async checkIn(userId) {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    await db.query(
      'INSERT INTO attendance (user_id, date, check_in, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE check_in = ?, status = ?',
      [userId, today, currentTime, 'present', currentTime, 'present']
    );
  }
  
  static async checkOut(userId) {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    await db.query(
      'UPDATE attendance SET check_out = ? WHERE user_id = ? AND date = ?',
      [currentTime, userId, today]
    );
  }
  
  static async getUserAttendance(userId, startDate, endDate) {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
      [userId, startDate, endDate]
    );
    return rows;
  }
  
  static async getAllAttendance(companyId, date) {
    const [rows] = await db.query(
      `SELECT a.*, u.name, u.login_id FROM attendance a 
       JOIN users u ON a.user_id = u.id 
       WHERE u.company_id = ? AND a.date = ?`,
      [companyId, date]
    );
    return rows;
  }
}

module.exports = Attendance;