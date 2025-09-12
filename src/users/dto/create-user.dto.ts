import { IsString, IsEmail, IsOptional, IsEnum, IsInt, Min, Max, IsPhoneNumber } from 'class-validator';
import { Role, MaritalStatus, Gender } from '../../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  profilePic?: string;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  age?: number;

  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @IsEnum(Gender)
  @IsOptional()
  sex?: Gender;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  password?: string;
} 