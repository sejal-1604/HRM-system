CREATE DATABASE IF NOT EXISTS dayflow_hrms;
USE dayflow_hrms;

-- Companies Table
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT,
    login_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL,
    profile_picture VARCHAR(255),
    job_position VARCHAR(255),
    department VARCHAR(255),
    manager VARCHAR(255),
    location VARCHAR(255),
    password_changed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Private Info Table
CREATE TABLE private_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    date_of_birth DATE,
    residing_address TEXT,
    nationality VARCHAR(100),
    personal_email VARCHAR(255),
    gender ENUM('male', 'female', 'other'),
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    date_of_joining DATE,
    account_number VARCHAR(50),
    bank_name VARCHAR(255),
    ifsc_code VARCHAR(20),
    pan_no VARCHAR(20),
    uan_no VARCHAR(20),
    emp_code VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Salary Info Table
CREATE TABLE salary_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    monthly_wage DECIMAL(10, 2),
    yearly_wage DECIMAL(10, 2),
    working_days_per_week INT,
    break_time_hours DECIMAL(4, 2),
    basic_salary DECIMAL(10, 2),
    basic_percentage DECIMAL(5, 2),
    hra DECIMAL(10, 2),
    hra_percentage DECIMAL(5, 2),
    standard_allowance DECIMAL(10, 2),
    standard_allowance_percentage DECIMAL(5, 2),
    performance_bonus DECIMAL(10, 2),
    performance_bonus_percentage DECIMAL(5, 2),
    lta DECIMAL(10, 2),
    lta_percentage DECIMAL(5, 2),
    fixed_allowance DECIMAL(10, 2),
    fixed_allowance_percentage DECIMAL(5, 2),
    employee_pf DECIMAL(10, 2),
    employee_pf_percentage DECIMAL(5, 2),
    employer_pf DECIMAL(10, 2),
    employer_pf_percentage DECIMAL(5, 2),
    professional_tax DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Resume Table
CREATE TABLE resume (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    about TEXT,
    what_i_love TEXT,
    interests_hobbies TEXT,
    skills TEXT,
    certifications TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Attendance Table
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('present', 'absent', 'half-day', 'leave') DEFAULT 'absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date)
);

-- Leave Requests Table
CREATE TABLE leave_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    leave_type ENUM('paid', 'sick', 'unpaid') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    remarks TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Login ID Counter Table (for generating sequential login IDs)
CREATE TABLE login_id_counter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT,
    year INT,
    counter INT DEFAULT 0,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE KEY unique_company_year (company_id, year)
);