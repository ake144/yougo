import { PartialType } from '@nestjs/mapped-types';
import { CreatePrayerRequestDto } from './create-prayer-request.dto';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PrayerRequestStatus } from '../../entities/prayer-request.entity';

export class UpdatePrayerRequestDto extends PartialType(CreatePrayerRequestDto) {
  @IsEnum(PrayerRequestStatus)
  @IsOptional()
  status?: PrayerRequestStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
