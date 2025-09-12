import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class LoginDto {
   @IsString()
  @IsOptional()
  name?: string;


  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;



  @IsNotEmpty({ message: 'Either email or phone must be provided' })
  get hasContactInfo(): boolean {
    return !!(this.email || this.phone);
  }
} 