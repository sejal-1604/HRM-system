-- Add password_changed field to existing users table
USE dayflow_hrms;

-- Add the column if it doesn't exist
ALTER TABLE users 
ADD COLUMN password_changed BOOLEAN DEFAULT FALSE 
AFTER location;

-- Set existing users to have password_changed = true (they've already changed their password)
UPDATE users SET password_changed = TRUE WHERE created_at < NOW();

-- For test users, set password_changed = true so they don't get redirected to change password
UPDATE users SET password_changed = TRUE WHERE email IN ('admin@testcompany.com', 'john@testcompany.com', 'jane@testcompany.com');
