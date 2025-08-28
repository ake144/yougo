-- YouGo Church Database Setup Script
-- This script creates the necessary tables for the church management system

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS User;

-- Create User table
CREATE TABLE User (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    qrCode VARCHAR(255),
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

-- Create Attendance table
CREATE TABLE Attendance (
    id VARCHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    isPresent BOOLEAN DEFAULT TRUE NOT NULL,
    userId VARCHAR(36) NOT NULL,
    serviceType VARCHAR(255),
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate attendance records
    UNIQUE KEY unique_user_date (userId, date),
    
    -- Indexes for better performance
    INDEX idx_attendance_userId (userId),
    INDEX idx_attendance_date (date),
    INDEX idx_attendance_isPresent (isPresent)
);

-- Insert sample admin user
INSERT INTO User (id, name, email, phone, role, createdAt, updatedAt) VALUES (
    UUID(),
    'Church Administrator',
    'admin@yougochurch.com',
    '+1234567890',
    'ADMIN',
    NOW(),
    NOW()
);

-- Insert sample regular user
INSERT INTO User (id, name, email, phone, role, createdAt, updatedAt) VALUES (
    UUID(),
    'John Doe',
    'john.doe@example.com',
    '+1234567891',
    'USER',
    NOW(),
    NOW()
);

-- Insert sample attendance records
INSERT INTO Attendance (id, date, isPresent, userId, serviceType, notes, createdAt, updatedAt)
SELECT 
    UUID(),
    CURDATE(),
    TRUE,
    u.id,
    'Sunday Service',
    'Regular Sunday worship service',
    NOW(),
    NOW()
FROM User u
WHERE u.role = 'USER'
LIMIT 1;

-- Display table structure
DESCRIBE User;
DESCRIBE Attendance;

-- Display sample data
SELECT 'User Table:' as TableName;
SELECT id, name, email, role, createdAt FROM User;

SELECT 'Attendance Table:' as TableName;
SELECT a.id, a.date, a.isPresent, u.name as userName, a.serviceType 
FROM Attendance a 
JOIN User u ON a.userId = u.id; 