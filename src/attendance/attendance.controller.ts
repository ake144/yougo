import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  Query, 
  Param, 
  Body,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { Attendance } from '../entities/attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async findByUserId(@Query('userId') userId: string): Promise<Attendance[]> {
    if (!userId) {
      throw new Error('userId is required');
    }
    return await this.attendanceService.findByUserId(userId);
  }

  @Get('recent/:userId')
  async getRecentAttendance(
    @Param('userId') userId: string,
    @Query('days') days: string
  ): Promise<Attendance[]> {
    const daysNumber = days ? parseInt(days) : 30;
    return await this.attendanceService.getRecentAttendance(userId, daysNumber);
  }

  @Get('monthly/:userId')
  async getMonthlyStats(
    @Param('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string
  ) {
    const yearNumber = parseInt(year);
    const monthNumber = parseInt(month);
    
    if (isNaN(yearNumber) || isNaN(monthNumber)) {
      throw new Error('Invalid year or month');
    }
    
    return await this.attendanceService.getMonthlyStats(userId, yearNumber, monthNumber);
  }

  @Get('service/:userId')
  async getAttendanceByServiceType(
    @Param('userId') userId: string,
    @Query('type') serviceType: string
  ): Promise<Attendance[]> {
    if (!serviceType) {
      throw new Error('Service type is required');
    }
    return await this.attendanceService.getAttendanceByServiceType(userId, serviceType);
  }

  @Post('mark')
  @HttpCode(HttpStatus.CREATED)
  async markAttendance(@Body() markAttendanceDto: MarkAttendanceDto): Promise<Attendance> {
    return await this.attendanceService.markAttendance(markAttendanceDto);
  }

  @Get('stats/:userId')
  async getAttendanceStats(@Param('userId') userId: string) {
    return await this.attendanceService.getAttendanceStats(userId);
  }

  @Get('range/:userId')
  async getAttendanceByDateRange(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<Attendance[]> {
    if (!startDate || !endDate) {
      throw new Error('startDate and endDate are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }

    return await this.attendanceService.getAttendanceByDateRange(userId, start, end);
  }

  @Get('overall/stats')
  async getOverallStats() {
    return await this.attendanceService.getOverallStats();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAttendance(@Param('id') id: string): Promise<void> {
    const deleted = await this.attendanceService.deleteAttendance(id);
    if (!deleted) {
      throw new Error('Attendance record not found');
    }
  }
} 