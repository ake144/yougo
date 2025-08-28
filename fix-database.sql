-- Fix existing database constraints
USE yougo_church;

-- Drop existing tables to recreate them properly
DROP TABLE IF EXISTS `Attendance`;
DROP TABLE IF EXISTS `User`;

-- Recreate User table without problematic constraints
CREATE TABLE `User` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `qrCode` varchar(255) DEFAULT NULL,
  `profilePic` varchar(500) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `maritalStatus` varchar(50) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `address` text DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_User_email` (`email`),
  KEY `IDX_User_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recreate Attendance table
CREATE TABLE `Attendance` (
  `id` varchar(36) NOT NULL,
  `date` datetime NOT NULL,
  `isPresent` tinyint(1) NOT NULL DEFAULT 0,
  `userId` varchar(36) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_Attendance_userId_date` (`userId`, `date`),
  KEY `IDX_Attendance_userId` (`userId`),
  KEY `IDX_Attendance_date` (`date`),
  CONSTRAINT `FK_Attendance_User` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Show the fixed tables
SHOW TABLES;
DESCRIBE `User`;
DESCRIBE `Attendance`; 