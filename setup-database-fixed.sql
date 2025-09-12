-- YouGo Church Database Setup Script (Fixed Version)
-- This script creates the necessary tables with proper UUID handling

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS User;

-- Create User table with proper UUID handling
CREATE TABLE User (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    profilePic VARCHAR(500),
    age INT UNSIGNED,
    maritalStatus ENUM('Single', 'Married', 'Divorced', 'Widowed'),
    sex ENUM('Male', 'Female', 'Other'),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER' NOT NULL,
    address TEXT,
    occupation VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_user_email (email),
    INDEX idx_user_phone (phone),
    INDEX idx_user_role (role),
    INDEX idx_user_name (name)
);

-- Create Attendance table with proper UUID handling
CREATE TABLE PrayerRequest (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    prayerRequest VARCHAR(255),
    notes TEXT,
    isAnonymous BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_prayer_request_date (requestDate);
);


-- Insert sample admin user with explicit UUID
INSERT INTO User (id, name, email, phone, role, createdAt, updatedAt) VALUES (
    UUID(),
    'Church Administrator',
    'admin@yougochurch.com',
    '+1234567890',
    'ADMIN',
    NOW(),
    NOW()
);

-- Insert sample regular user with explicit UUID
INSERT INTO User (id, name, email, phone, role, createdAt, updatedAt) VALUES (
    UUID(),
    'John Doe',
    'john.doe@example.com',
    '+1234567891',
    'USER',
    NOW(),
    NOW()
);


Insert INTO PrayerRequest (id, name, email, phone, prayerRequest, notes, isAnonymous, createdAt, updatedAt) VALUES (
    UUID(),
    'Jane Smith',
    'jane.smith@example.com',
    '+1234567892',
    'Pray for my family',
    'Urgent prayer request for family issues',
    FALSE,
    NOW(),
    NOW()
);

-- Display table structure
DESCRIBE User;


-- Display sample data
SELECT 'User Table:' as TableName;
SELECT id, name, email, role, createdAt FROM User;

SELECT 'Attendance Table:' as TableName;
SELECT id, userId, date, isPresent, serviceType FROM Attendance;

-- Verify foreign key relationships
SELECT 
    'Foreign Key Check:' as Status,
    COUNT(*) as total_attendance,
    COUNT(DISTINCT userId) as unique_users,
    COUNT(*) - COUNT(DISTINCT userId) as orphaned_records
FROM Attendance a
LEFT JOIN User u ON a.userId = u.id
WHERE u.id IS NULL; 