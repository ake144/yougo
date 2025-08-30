import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from '../entities/attendance.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance]),
    forwardRef(() => AuthModule),
],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {} 