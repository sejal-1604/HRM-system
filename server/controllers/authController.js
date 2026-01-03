const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { companyName, name, email, phone, password, role } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findByEmailOrLoginId(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create user
    const result = await User.create({ companyName, name, email, phone, password, role });
    
    res.status(201).json({ 
      message: 'User created successfully', 
      loginId: result.loginId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Find user
    const user = await User.findByEmailOrLoginId(identifier);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, companyId: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loginId: user.login_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};