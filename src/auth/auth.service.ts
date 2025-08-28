import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, Role } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, phone, name } = loginDto;
    
    if (!loginDto.hasContactInfo) {
      throw new BadRequestException('Either email or phone must be provided');
    }
    
    if (!name || !name.trim()) {
      throw new BadRequestException('Name is required');
    }

    try {
      let user = await this.usersService.findByEmailOrPhone(email, phone);

      if (!user) {
        // Create new user record
        const userData = {
          name: name.trim(),
          email: email || undefined,
          phone: phone || undefined,
          role: Role.USER,
        };

        // Generate placeholder email if none provided
        if (!email && phone) {
          userData.email = `user_${Date.now()}@placeholder.com`;
        }

        user = await this.usersService.create(userData);
      } else {
        // Update existing user's name if provided and different
        if (name.trim() !== user.name) {
          user = await this.usersService.update(user.id, { name: name.trim() });
        }
      }

      if (!user) {
        throw new BadRequestException('Failed to create or update user');
      }

      const token = await this.jwtService.signAsync({ 
        sub: user.id, 
        email: user.email, 
        phone: user.phone,
        role: user.role
      }, { secret: process.env.JWT_SECRET });

      return { user, token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Login failed');
    }
  }

  async verify(token: string): Promise<User | null> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
    
      const userId = decoded.sub as string;
      
      if (!userId) {
        return null;
      }
      
      return await this.usersService.findById(userId);
    } catch (error) {
      return null;
    }
  }

  async refreshToken(userId: string): Promise<string> {
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return await this.jwtService.signAsync({ 
        sub: user.id, 
        email: user.email, 
        phone: user.phone,
        role: user.role
      });
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    try {
      return await this.usersService.findById(userId);
    } catch (error) {
      return null;
    }
  }
} 