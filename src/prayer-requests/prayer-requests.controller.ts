import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto';
import { UpdatePrayerRequestDto } from './dto/update-prayer-request.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('prayer-requests')
export class PrayerRequestsController {
  constructor(private readonly prayerRequestsService: PrayerRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPrayerRequestDto: CreatePrayerRequestDto) {
    return await this.prayerRequestsService.create(createPrayerRequestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('status') status?: string,
  ) {
    if (status) { 
      return await this.prayerRequestsService.findByStatus(status);
    }

    return await this.prayerRequestsService.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return await this.prayerRequestsService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.prayerRequestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePrayerRequestDto: UpdatePrayerRequestDto,
  ) {
    return await this.prayerRequestsService.update(id, updatePrayerRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.prayerRequestsService.remove(id);
  }
}
