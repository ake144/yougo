import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Param, 
  Body, 
  Query,
  UseGuards,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Role } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('count')
  async getUsersCount(): Promise<{ total: number; admins: number; users: number }> {
    return await this.usersService.getUsersCount();
  }

  @Get('search')
  async searchUsers(@Query('q') query: string): Promise<User[]> {
    if (!query) {
      return await this.usersService.findAll();
    }
    return await this.usersService.searchUsers(query);
  }

  @Get('admins')
  async findAdmins(): Promise<User[]> {
    return await this.usersService.findAdmins();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Put(':id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: Role }): Promise<User> {
    return await this.usersService.updateRole(id, body.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.usersService.delete(id);
    if (!deleted) {
      throw new Error('User not found');
    }
  }
} 