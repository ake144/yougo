import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { User, Role, MaritalStatus, Gender } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        order: { name: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ 
        where: { id }
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch user');
    }
  }

  async findByEmailOrPhone(email?: string, phone?: string): Promise<User | null> {
    if (!email && !phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    try {
      if (email && phone) {
        return await this.userRepository.findOne({
          where: [
            { email },
            { phone }
          ]
        });
      }

      if (email) {
        return await this.userRepository.findOne({ 
          where: { email }
        });
      }

      return await this.userRepository.findOne({ 
          where: { phone }
      });
    } catch (error) {
      throw new BadRequestException('Failed to find user');
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: [
          { name: ILike(`%${query}%`) },
          { email: ILike(`%${query}%`) },
          { phone: ILike(`%${query}%`) }
        ],
        order: { name: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Failed to search users');
    }
  }

  async findAdmins(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { role: Role.ADMIN },
        order: { name: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch admins');
    }
  }

  async create(userData: CreateUserDto): Promise<User> {
    try {
      // Check for existing user with same email or phone
      if (userData.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: userData.email }
        });
        if (existingEmail) {
          throw new ConflictException('User with this email already exists');
        }
      }

      if (userData.phone) {
        const existingPhone = await this.userRepository.findOne({
          where: { phone: userData.phone }
        });
        if (existingPhone) {
          throw new ConflictException('User with this phone already exists');
        }
      }

      // Generate placeholder email if none provided
      if (!userData.email && userData.phone) {
        userData.email = `user_${Date.now()}@placeholder.com`;
      }

      const user = this.userRepository.create({
        ...userData,
        role: userData.role || Role.USER
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check for conflicts if email or phone is being updated
      if (userData.email && userData.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: userData.email }
        });
        if (existingEmail) {
          throw new ConflictException('User with this email already exists');
        }
      }

      if (userData.phone && userData.phone !== user.phone) {
        const existingPhone = await this.userRepository.findOne({
          where: { phone: userData.phone }
        });
        if (existingPhone) {
          throw new ConflictException('User with this phone already exists');
        }
      }

      Object.assign(user, userData);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const result = await this.userRepository.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete user');
    }
  }

  async updateRole(id: string, role: Role): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.role = role;
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user role');
    }
  }

  async getUsersCount(): Promise<{ total: number; admins: number; users: number }> {
    try {
      const [total, admins] = await Promise.all([
        this.userRepository.count(),
        this.userRepository.count({ where: { role: Role.ADMIN } })
      ]);

      return {
        total,
        admins,
        users: total - admins
      };
    } catch (error) {
      throw new BadRequestException('Failed to get users count');
    }
  }
} 