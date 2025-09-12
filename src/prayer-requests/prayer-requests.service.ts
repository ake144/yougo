import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerRequest } from '../entities/prayer-request.entity';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto';
import { UpdatePrayerRequestDto } from './dto/update-prayer-request.dto';

@Injectable()
export class PrayerRequestsService {
  constructor(
    @InjectRepository(PrayerRequest)
    private prayerRequestRepository: Repository<PrayerRequest>,
  ) {}

  async create(createPrayerRequestDto: CreatePrayerRequestDto): Promise<PrayerRequest> {
    const prayerRequest = this.prayerRequestRepository.create(createPrayerRequestDto);
    return await this.prayerRequestRepository.save(prayerRequest);
  }

  async findAll(): Promise<PrayerRequest[]> {
    return await this.prayerRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PrayerRequest> {
    const prayerRequest = await this.prayerRequestRepository.findOne({
      where: { id },
    });

    if (!prayerRequest) {
      throw new NotFoundException(`Prayer request with ID ${id} not found`);
    }

    return prayerRequest;
  }

  async update(id: string, updatePrayerRequestDto: UpdatePrayerRequestDto): Promise<PrayerRequest> {
    const prayerRequest = await this.findOne(id);
    
    Object.assign(prayerRequest, updatePrayerRequestDto);
    
    return await this.prayerRequestRepository.save(prayerRequest);
  }

  async remove(id: string): Promise<void> {
    const prayerRequest = await this.findOne(id);
    await this.prayerRequestRepository.remove(prayerRequest);
  }

  async findByStatus(status: string): Promise<PrayerRequest[]> {
    return await this.prayerRequestRepository.find({
      where: { status: status as any },
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: string): Promise<PrayerRequest[]> {
    return await this.prayerRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    answered: number;
    closed: number;
  }> {
    const [total, pending, inProgress, answered, closed] = await Promise.all([
      this.prayerRequestRepository.count(),
      this.prayerRequestRepository.count({ where: { status: 'Pending' as any } }),
      this.prayerRequestRepository.count({ where: { status: 'In Progress' as any } }),
      this.prayerRequestRepository.count({ where: { status: 'Answered' as any } }),
      this.prayerRequestRepository.count({ where: { status: 'Closed' as any } }),
    ]);

    return { total, pending, inProgress, answered, closed };
  }
}
