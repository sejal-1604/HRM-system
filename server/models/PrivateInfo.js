const db = require('../config/db');

class PrivateInfo {
  
  static async get(userId) {
    const [rows] = await db.query('SELECT * FROM private_info WHERE user_id = ?', [userId]);
    return rows[0];
  }
  
  static async createOrUpdate(userId, data) {
    const fields = [
      'date_of_birth', 'residing_address', 'nationality', 'personal_email',
      'gender', 'marital_status', 'date_of_joining', 'account_number',
      'bank_name', 'ifsc_code', 'pan_no', 'uan_no', 'emp_code'
    ];
    
    const [existing] = await db.query('SELECT id FROM private_info WHERE user_id = ?', [userId]);
    
    if (existing.length === 0) {
      // Insert
      const values = fields.map(f => data[f] || null);
      await db.query(
        `INSERT INTO private_info (user_id, ${fields.join(', ')}) VALUES (?, ${fields.map(() => '?').join(', ')})`,
        [userId, ...values]
      );
    } else {
      // Update
      const updates = fields.map(f => `${f} = ?`).join(', ');
      const values = fields.map(f => data[f] || null);
      await db.query(
        `UPDATE private_info SET ${updates} WHERE user_id = ?`,
        [...values, userId]
      );
    }
  }
}

module.exports = PrivateInfo;