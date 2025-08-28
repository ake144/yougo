import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async findByUserId(userId: string, limit: number = 50): Promise<Attendance[]> {
    try {
      return await this.attendanceRepository.find({
        where: { userId },
        order: { date: 'DESC' },
        take: limit,
        relations: ['user']
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch attendance records');
    }
  }

  async findById(id: string): Promise<Attendance | null> {
    try {
      return await this.attendanceRepository.findOne({
        where: { id },
        relations: ['user']
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch attendance record');
    }
  }

  async markAttendance(markAttendanceDto: MarkAttendanceDto): Promise<Attendance> {
    try {
      const { userId, date, isPresent = true, serviceType, notes } = markAttendanceDto;
      
      // Parse date string to Date object
      const attendanceDate = new Date(date);
      if (isNaN(attendanceDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      // Check if attendance already exists for this user and date
      const existing = await this.attendanceRepository.findOne({
        where: {
          userId,
          date: Between(
            new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate()),
            new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate(), 23, 59, 59)
          )
        }
      });
      
      if (existing) {
        // Update existing record
        existing.isPresent = isPresent;
        if (serviceType !== undefined) existing.serviceType = serviceType;
        if (notes !== undefined) existing.notes = notes;
        return await this.attendanceRepository.save(existing);
      } else {
        // Create new record
        const attendance = new Attendance();
        attendance.userId = userId;
        attendance.date = attendanceDate;
        attendance.isPresent = isPresent;
        if (serviceType !== undefined) attendance.serviceType = serviceType;
        if (notes !== undefined) attendance.notes = notes;
        return await this.attendanceRepository.save(attendance);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to mark attendance');
    }
  }

  async getAttendanceByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    try {
      return await this.attendanceRepository.find({
        where: {
          userId,
          date: Between(startDate, endDate)
        },
        order: { date: 'DESC' },
        relations: ['user']
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch attendance by date range');
    }
  }

  async getAttendanceStats(userId: string): Promise<{ total: number; present: number; absent: number; percentage: number }> {
    try {
      const [total, present] = await Promise.all([
        this.attendanceRepository.count({ where: { userId } }),
        this.attendanceRepository.count({ where: { userId, isPresent: true } })
      ]);
      
      const absent = total - present;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      return { total, present, absent, percentage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch attendance stats');
    }
  }

  async getMonthlyStats(userId: string, year: number, month: number): Promise<{ total: number; present: number; absent: number; percentage: number }> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const [total, present] = await Promise.all([
        this.attendanceRepository.count({
          where: {
            userId,
            date: Between(startDate, endDate)
          }
        }),
        this.attendanceRepository.count({
          where: {
            userId,
            date: Between(startDate, endDate),
            isPresent: true
          }
        })
      ]);

      const absent = total - present;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      return { total, present, absent, percentage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch monthly attendance stats');
    }
  }

  async getRecentAttendance(userId: string, days: number = 30): Promise<Attendance[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await this.attendanceRepository.find({
        where: {
          userId,
          date: MoreThanOrEqual(startDate)
        },
        order: { date: 'DESC' },
        relations: ['user']
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch recent attendance');
    }
  }

  async deleteAttendance(id: string): Promise<boolean> {
    try {
      const result = await this.attendanceRepository.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      throw new BadRequestException('Failed to delete attendance record');
    }
  }

  async getAttendanceByServiceType(userId: string, serviceType: string): Promise<Attendance[]> {
    try {
      return await this.attendanceRepository.find({
        where: {
          userId,
          serviceType
        },
        order: { date: 'DESC' },
        relations: ['user']
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch attendance by service type');
    }
  }

  async getOverallStats(): Promise<{ totalRecords: number; totalUsers: number; averageAttendance: number }> {
    try {
      const [totalRecords, totalUsers] = await Promise.all([
        this.attendanceRepository.count(),
        this.attendanceRepository.createQueryBuilder('attendance')
          .select('COUNT(DISTINCT attendance.userId)', 'count')
          .getRawOne()
      ]);

      const averageAttendance = totalUsers > 0 ? Math.round(totalRecords / parseInt(totalUsers.count)) : 0;

      return {
        totalRecords,
        totalUsers: parseInt(totalUsers.count),
        averageAttendance
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch overall attendance stats');
    }
  }
} 