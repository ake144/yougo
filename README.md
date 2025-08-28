# YouGo Church Backend API

A robust NestJS backend API for the YouGo Church management system, featuring user management, attendance tracking, and authentication.

## 🚀 Features

- **User Management**: Complete CRUD operations for church members
- **Attendance Tracking**: QR code-based attendance system with detailed analytics
- **Authentication**: JWT-based authentication with cookie support
- **Role-Based Access**: Admin and user role management
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Centralized error handling with detailed error responses
- **Logging**: Request/response logging and performance monitoring
- **Database**: MySQL with TypeORM for efficient data management

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with cookie-based storage
- **Validation**: class-validator & class-transformer
- **Language**: TypeScript
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Or use the setup script
   chmod +x setup-env.sh
   ./setup-env.sh
   ```

3. **Database Setup**
   ```bash
   # Run the database setup script
   chmod +x setup-database.sh
   ./setup-database.sh
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production build
   npm run build
   npm run start:prod
   ```

## 🌍 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=yougo_church

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Schema

### User Table
- `id`: UUID primary key
- `name`: Full name (required)
- `email`: Email address (unique, optional)
- `phone`: Phone number (unique, optional)
- `role`: User role (USER/ADMIN)
- `age`: Age in years
- `maritalStatus`: Marital status enum
- `sex`: Gender enum
- `address`: Physical address
- `occupation`: Professional occupation
- `qrCode`: QR code identifier
- `profilePic`: Profile picture URL
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Attendance Table
- `id`: UUID primary key
- `date`: Attendance date
- `isPresent`: Attendance status
- `userId`: Foreign key to User table
- `serviceType`: Type of service attended
- `notes`: Additional notes
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login/registration
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate/:userId` - Validate user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/count` - Get user statistics
- `GET /api/users/search` - Search users
- `GET /api/users/admins` - Get admin users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Attendance
- `GET /api/attendance` - Get user attendance
- `GET /api/attendance/recent/:userId` - Get recent attendance
- `GET /api/attendance/monthly/:userId` - Get monthly stats
- `GET /api/attendance/service/:userId` - Get by service type
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/stats/:userId` - Get attendance statistics
- `GET /api/attendance/range/:userId` - Get by date range
- `GET /api/attendance/overall/stats` - Get overall statistics
- `DELETE /api/attendance/:id` - Delete attendance record

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

The API uses JWT tokens stored in HTTP-only cookies for security:

1. **Login**: Send credentials to `/api/auth/login`
2. **Token Storage**: JWT is automatically stored in cookies
3. **Protected Routes**: Include cookies in subsequent requests
4. **Token Refresh**: Use `/api/auth/refresh` to extend sessions
5. **Logout**: Clear cookies via `/api/auth/logout`

## 📊 Data Validation

All API endpoints use comprehensive validation:

- **Input Validation**: class-validator decorators
- **Type Transformation**: Automatic type conversion
- **Error Handling**: Detailed validation error messages
- **Security**: Whitelist validation to prevent injection

## 🚨 Error Handling

The API provides consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/users",
  "details": "email must be an email"
}
```

## 📝 Logging

Comprehensive logging for monitoring and debugging:

- **Request Logging**: All incoming requests
- **Response Logging**: Success/failure responses
- **Performance Monitoring**: Response time tracking
- **Error Logging**: Detailed error information

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   DB_HOST=your_production_db_host
   DB_PASSWORD=your_production_db_password
   JWT_SECRET=your_production_jwt_secret
   ```

3. **Start the application**
   ```bash
   npm run start:prod
   ```

## 🔧 Development

### Code Structure
```
src/
├── auth/           # Authentication module
├── users/          # User management module
├── attendance/     # Attendance tracking module
├── common/         # Shared utilities and interceptors
├── config/         # Configuration files
├── entities/       # TypeORM entities
└── main.ts         # Application entry point
```

### Adding New Features
1. Create entity in `src/entities/`
2. Create DTOs in `src/[module]/dto/`
3. Implement service in `src/[module]/[module].service.ts`
4. Create controller in `src/[module]/[module].controller.ts`
5. Add module to `src/app.module.ts`

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
