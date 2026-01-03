USE dayflow_hrms;

-- Insert a test company
INSERT IGNORE INTO companies (id, name) VALUES (1, 'Test Company');

-- Insert test admin user
INSERT IGNORE INTO users (
    id, company_id, login_id, name, email, phone, password, role
) VALUES (
    1, 1, 'TCAD20250001', 'Admin User', 'admin@testcompany.com', '9876543210', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'
);

-- Insert test employee users
INSERT IGNORE INTO users (
    id, company_id, login_id, name, email, phone, password, role
) VALUES (
    2, 1, 'TCJO20250002', 'John Employee', 'john@testcompany.com', '9876543211',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee'
);

INSERT IGNORE INTO users (
    id, company_id, login_id, name, email, phone, password, role
) VALUES (
    3, 1, 'TCJA20250003', 'Jane Employee', 'jane@testcompany.com', '9876543212',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee'
);

-- The password hash above is for 'password123'
SELECT 'Test users created successfully' as message;
SELECT login_id, name, email, role FROM users WHERE company_id = 1;
