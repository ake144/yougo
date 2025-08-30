-- Fix YouGo Church Database ID Issues
-- This script ensures proper UUID generation and fixes any existing data

-- First, let's check the current state
SELECT 'Current User IDs:' as Status;
SELECT id, name, email, role FROM User WHERE id IS NULL OR id = '';

-- Check if UUID() function is available
SELECT UUID() as test_uuid;

-- Fix User table structure to ensure proper UUID generation
ALTER TABLE User MODIFY COLUMN id VARCHAR(36) NOT NULL;

-- Update any existing users with empty IDs to have proper UUIDs
UPDATE User SET id = UUID() WHERE id IS NULL OR id = '';

-- Fix Attendance table structure
ALTER TABLE Attendance MODIFY COLUMN id VARCHAR(36) NOT NULL;
ALTER TABLE Attendance MODIFY COLUMN userId VARCHAR(36) NOT NULL;

-- Update any existing attendance records with empty IDs
UPDATE Attendance SET id = UUID() WHERE id IS NULL OR id = '';

-- Ensure foreign key constraints are properly set
ALTER TABLE Attendance 
DROP FOREIGN KEY IF EXISTS Attendance_ibfk_1;

ALTER TABLE Attendance 
ADD CONSTRAINT Attendance_ibfk_1 
FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE;

-- Insert a test admin user if none exists
INSERT IGNORE INTO User (id, name, email, phone, role, createdAt, updatedAt) VALUES (
    UUID(),
    'Church Administrator',
    'admin@yougochurch.com',
    '+1234567890',
    'ADMIN',
    NOW(),
    NOW()
);

-- Verify the fix
SELECT 'Fixed User IDs:' as Status;
SELECT id, name, email, role FROM User;

SELECT 'Fixed Attendance IDs:' as Status;
SELECT id, userId, date, isPresent FROM Attendance;

-- Show table structure
DESCRIBE User;
DESCRIBE Attendance; 