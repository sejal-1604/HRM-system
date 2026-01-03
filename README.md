# Dayflow - Human Resource Management System

A comprehensive HRMS solution for employee management, attendance tracking, leave management, and payroll administration.

## Features

- **Authentication & Authorization**: Secure sign up/sign in with role-based access (Admin/Employee)
- **Employee Profile Management**: Complete profile management with personal and professional details
- **Attendance Tracking**: Daily and weekly attendance with check-in/check-out functionality
- **Leave Management**: Apply for leaves and manage approval workflows
- **Payroll Management**: Salary structure and payroll visibility
- **Dashboard**: Role-specific dashboards for quick access to key features

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
HRM_project/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend application
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   └── package.json
├── database/
│   └── schema.sql       # Database schema
└── start.bat           # Quick start script
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Ensure MySQL server is running
2. Create the database using the provided schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### 2. Server Configuration

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=dayflow_hrms
     JWT_SECRET=your_jwt_secret_key
     PORT=4000
     ```

### 3. Client Configuration

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Quick Start (Windows)

Run the provided batch file:
```bash
start.bat
```

### Manual Start

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm start
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Users
- `GET /api/users/employees` - Get all employees (Admin only)
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile
- `PUT /api/users/private-info/:id` - Update private info
- `PUT /api/users/salary-info/:id` - Update salary info (Admin only)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out

### Leave Requests
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id` - Update leave status (Admin only)

## User Roles

### Admin/HR Officer
- Manage employee profiles
- Approve/reject leave requests
- View all attendance records
- Manage payroll information
- Access comprehensive dashboard

### Employee
- View and edit personal profile
- View own attendance records
- Apply for leave
- View salary information
- Access personal dashboard

## Database Schema

The application uses the following main tables:
- `companies` - Company information
- `users` - User accounts and basic info
- `private_info` - Personal employee details
- `salary_info` - Salary structure and components
- `resume` - Professional information
- `attendance` - Attendance records
- `leave_requests` - Leave applications
- `login_id_counter` - Sequential login ID generation

## Development

### Adding New Features

1. **Backend**: Add routes, controllers, and models as needed
2. **Frontend**: Create components and pages following the existing structure
3. **Database**: Update schema.sql for any database changes

### Environment Variables

Ensure these are set in your `.env` file:
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for JWT token generation
- `PORT` - Server port (default: 4000)

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL server is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Port Conflicts**
   - Change PORT in server `.env` if 4000 is in use
   - Client uses port 3000 by default

3. **CORS Issues**
   - Server is configured to allow requests from localhost:3000
   - For other origins, update CORS configuration in server.js

## License

This project is licensed under the ISC License.