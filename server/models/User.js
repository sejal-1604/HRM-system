const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  
  // Generate Login ID
  static async generateLoginId(companyName, firstName, lastName, year) {
    const companyInitials = companyName.substring(0, 2).toUpperCase();
    const nameInitials = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
    
    // Get company ID
    const [companies] = await db.query('SELECT id FROM companies WHERE name = ?', [companyName]);
    const companyId = companies[0].id;
    
    // Get or create counter for this year
    await db.query(
      'INSERT INTO login_id_counter (company_id, year, counter) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE counter = counter + 1',
      [companyId, year]
    );
    
    const [counter] = await db.query(
      'SELECT counter FROM login_id_counter WHERE company_id = ? AND year = ?',
      [companyId, year]
    );
    
    const serialNumber = String(counter[0].counter).padStart(4, '0');
    return `${companyInitials}${nameInitials}${year}${serialNumber}`;
  }
  
  // Create new user
  static async create(userData) {
    const { companyName, name, email, phone, password, role } = userData;
    
    // Get or create company
    let [companies] = await db.query('SELECT id FROM companies WHERE name = ?', [companyName]);
    let companyId;
    
    if (companies.length === 0) {
      const [result] = await db.query('INSERT INTO companies (name) VALUES (?)', [companyName]);
      companyId = result.insertId;
    } else {
      companyId = companies[0].id;
    }
    
    // Generate login ID
    const currentYear = new Date().getFullYear();
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || firstName;
    const loginId = await this.generateLoginId(companyName, firstName, lastName, currentYear);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (company_id, login_id, name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [companyId, loginId, name, email, phone, hashedPassword, role]
    );
    
    return { id: result.insertId, loginId };
  }
  
  // Find user by email or login_id
  static async findByEmailOrLoginId(identifier) {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? OR login_id = ?',
      [identifier, identifier]
    );
    return users[0];
  }
  
  // Get all employees
  static async getAllEmployees(companyId) {
    const [users] = await db.query(
      'SELECT id, login_id, name, email, phone, profile_picture, job_position, department FROM users WHERE company_id = ?',
      [companyId]
    );
    return users;
  }
  
  // Get user profile
  static async getProfile(userId) {
    const [users] = await db.query(
      'SELECT u.*, c.name as company_name FROM users u JOIN companies c ON u.company_id = c.id WHERE u.id = ?',
      [userId]
    );
    return users[0];
  }
  
  // Update user profile
  static async updateProfile(userId, data) {
    const { name, phone, profile_picture, job_position, department, manager, location } = data;
    await db.query(
      'UPDATE users SET name = ?, phone = ?, profile_picture = ?, job_position = ?, department = ?, manager = ?, location = ? WHERE id = ?',
      [name, phone, profile_picture, job_position, department, manager, location, userId]
    );
  }
}

module.exports = User;