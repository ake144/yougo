import { IsString, IsDateString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class MarkAttendanceDto {
  @IsUUID()
  userId: string;

  @IsDateString()
  date: string;

  @IsBoolean()
  @IsOptional()
  isPresent?: boolean;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @IsString()
  @IsOptional()
  notes?: string;
} 