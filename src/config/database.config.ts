import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Attendance } from '../entities/attendance.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yougo_church',
  entities: [User, Attendance],
  synchronize: false, // Disable auto-sync to prevent data loss
  logging: process.env.NODE_ENV !== 'production',
  dropSchema: false, // Never drop schema automatically
  migrations: [],
  subscribers: [],
  // Connection options
  extra: {
    connectionLimit: 10,
  },
  // Retry connection options
  retryAttempts: 10,
  retryDelay: 3000,
}; 