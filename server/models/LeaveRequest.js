const db = require('../config/db');

class LeaveRequest {
  
  static async create(userId, data) {
    const { leave_type, start_date, end_date, remarks } = data;
    const [result] = await db.query(
      'INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, remarks) VALUES (?, ?, ?, ?, ?)',
      [userId, leave_type, start_date, end_date, remarks]
    );
    return result.insertId;
  }
  
  static async getUserRequests(userId) {
    const [rows] = await db.query(
      'SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
  
  static async getAllRequests(companyId) {
    const [rows] = await db.query(
      `SELECT lr.*, u.name, u.login_id FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       WHERE u.company_id = ?
       ORDER BY lr.created_at DESC`,
      [companyId]
    );
    return rows;
  }
  
  static async updateStatus(requestId, status, adminComments) {
    await db.query(
      'UPDATE leave_requests SET status = ?, admin_comments = ? WHERE id = ?',
      [status, adminComments, requestId]
    );
  }
}

module.exports = LeaveRequest;