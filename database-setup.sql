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
    profilePic VARCHAR(500),
    age INT UNSIGNED,
    maritalStatus ENUM('Single', 'Married'),
    sex ENUM('Male', 'Female'),
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

--
create table PrayerRequest (
    id VARCHAR(36) PRIMARY KEY,
    IMESTAMP,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    prayerRequest VARCHAR(255),
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_prayer_request_date (createdAt);
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

-- Display table structure
DESCRIBE User;

-- Display sample data
SELECT 'User Table:' as TableName;
SELECT id, name, email, role, createdAt FROM User;

SELECT 'Attendance Table:' as TableName;
SELECT a.id, a.date, a.isPresent, u.name as userName, a.serviceType

JOIN User u ON a.userId = u.id;