import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsPhoneNumber, MinLength, MaxLength } from 'class-validator';
import { PrayerRequestType } from '../../entities/prayer-request.entity';

export class CreatePrayerRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEnum(PrayerRequestType)
  @IsOptional()
  type?: PrayerRequestType;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
