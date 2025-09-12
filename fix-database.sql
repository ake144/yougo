-- Fix existing database constraints
USE yougo_church;

-- Drop existing tables to recreate them properly
DROP TABLE IF EXISTS `Attendance`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `PrayerRequest`;

-- Recreate User table without problematic constraints
CREATE TABLE `User` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
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


CREATE TABLE `PrayerRequest` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `prayerRequest` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `isAnonymous` boolean DEFAULT FALSE,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Show the fixed tables
SHOW TABLES;
DESCRIBE `User`;
DESCRIBE `PrayerRequest`;