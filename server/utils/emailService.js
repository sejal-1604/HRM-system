const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendWelcomeEmail = async (userEmail, userName, loginId, password, role) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Welcome to Dayflow HRMS - Your Account Details',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🏢 Dayflow HRMS</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Human Resource Management System</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #667eea;">
            <h2 style="color: #333; margin-top: 0;">Welcome to Dayflow, ${userName}!</h2>
            <p style="color: #666; line-height: 1.6;">Your account has been successfully created. Below are your login credentials:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">🔐 Your Login Credentials</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #333; width: 120px;">Login ID:</td>
                  <td style="padding: 8px; color: #333; font-family: monospace; background: #f1f3f4; border-radius: 4px;">${loginId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
                  <td style="padding: 8px; color: #333;">${userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #333;">Password:</td>
                  <td style="padding: 8px; color: #333; background: #fff3cd; border-radius: 4px;">${password}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #333;">Role:</td>
                  <td style="padding: 8px; color: #333; text-transform: capitalize;">${role}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
              <h4 style="color: #004085; margin-top: 0;">📝 Important Notes:</h4>
              <ul style="color: #004085; margin: 0; padding-left: 20px;">
                <li>Save your Login ID securely - you'll need it for all future logins</li>
                <li>You can login using either your Login ID or Email address</li>
                <li>Change your password after first login for security</li>
                <li>Keep this email for future reference</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/signin" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                🚀 Go to Login Page
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2025 Dayflow HRMS. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
};
