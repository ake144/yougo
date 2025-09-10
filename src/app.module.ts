import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { PrayerRequestsModule } from './prayer-requests/prayer-requests.module';
import { User } from './entities/user.entity';
import { Attendance } from './entities/attendance.entity';
import { PrayerRequest } from './entities/prayer-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('DATABASE_URL'),
        entities: [User, Attendance, PrayerRequest],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        dropSchema: false,
        migrations: [],
        subscribers: [],
        type: 'mysql',
        // host: configService.get<string>('DB_HOST', 'localhost'),
        // port: configService.get<number>('DB_PORT', 3306),
        // username: configService.get<string>('DB_USER', 'root'),
        // password: configService.get<string>('DB_PASSWORD', ''),
        // database: configService.get<string>('DB_NAME', 'yougo_church'),
        // entities: [User, Attendance],
        // synchronize: configService.get<string>('NODE_ENV') !== 'production',
        // logging: configService.get<string>('NODE_ENV') !== 'production',
        // dropSchema: false,
        // migrations: [],
        // subscribers: [],
        // extra: {
        //   connectionLimit: 10,
        // },
        // retryAttempts: 10,
        // retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AttendanceModule,
    AuthModule,
    PrayerRequestsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
