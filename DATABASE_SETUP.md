# Database Setup Guide

## Quick Setup

1. **Set up environment variables:**
   ```bash
   ./setup-env.sh
   ```

2. **Create database tables:**
   ```bash
   ./setup-database.sh
   ```

3. **Start the backend:**
   ```bash
   npm run start:dev
   ```

## Manual Database Setup

If you prefer to set up the database manually:

### 1. Create the Database
```sql
CREATE DATABASE yougo_church;
USE yougo_church;
```

### 2. Create User Table
```sql
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
  UNIQUE KEY `IDX_User_email` (`email`),
  KEY `IDX_User_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Create Attendance Table
```sql
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
```

## Database Schema

### User Table
- `id`: UUID primary key
- `name`: User's full name (required)
- `email`: Email address (optional, unique if provided)
- `phone`: Phone number (optional)
- `role`: User role (USER/ADMIN)
- `createdAt`/`updatedAt`: Timestamps

### Attendance Table
- `id`: UUID primary key
- `date`: Attendance date
- `isPresent`: Boolean attendance status
- `userId`: Foreign key to User table
- `createdAt`/`updatedAt`: Timestamps

## Testing the Setup

1. **Test database connection:**
   ```bash
   mysql -u your_user -p -h localhost yougo_church
   ```

2. **Check tables:**
   ```sql
   SHOW TABLES;
   DESCRIBE User;
   DESCRIBE Attendance;
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3001/health
   ```

## Troubleshooting

### "Unknown column" Errors
- Make sure you've run the database setup script
- Check that the tables exist: `SHOW TABLES;`
- Verify column names: `DESCRIBE User;`

### Connection Issues
- Ensure MySQL is running
- Check your `.env` file credentials
- Test connection manually: `mysql -u user -p -h host`

### Foreign Key Errors
- Make sure both tables exist
- Check that the User table has data before adding Attendance records 