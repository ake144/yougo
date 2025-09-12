import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsPhoneNumber, MinLength, MaxLength } from 'class-validator';

export class CreatePrayerRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;


  @IsOptional()
  email?: string;


  @IsOptional()
  phone?: string;


  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  prayerRequest: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
