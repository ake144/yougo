import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum PrayerRequestType {
  PERSONAL = 'Personal',
  FAMILY = 'Family',
  HEALTH = 'Health',
  FINANCIAL = 'Financial',
  SPIRITUAL = 'Spiritual',
  WORK = 'Work',
  RELATIONSHIP = 'Relationship',
  OTHER = 'Other',
}

export enum PrayerRequestStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  ANSWERED = 'Answered',
  CLOSED = 'Closed',
}

@Entity('PrayerRequest')
@Index(['email'], { where: 'email IS NOT NULL' })
@Index(['phone'], { where: 'phone IS NOT NULL' })
@Index(['status'])
@Index(['type'])
export class PrayerRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
    type: 'varchar', 
    length: 255,
    nullable: false 
  })
  name: string;

  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true 
  })
  email: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    nullable: true 
  })
  phone: string;

  @Column({ 
    type: 'enum', 
    enum: PrayerRequestType, 
    default: PrayerRequestType.PERSONAL 
  })
  type: PrayerRequestType;

  @Column({ 
    type: 'text', 
    nullable: false 
  })
  message: string;

  @Column({ 
    type: 'enum', 
    enum: PrayerRequestStatus, 
    default: PrayerRequestStatus.PENDING 
  })
  status: PrayerRequestStatus;

  @Column({ 
    type: 'boolean', 
    default: false 
  })
  isAnonymous: boolean;

  @Column({ 
    type: 'text', 
    nullable: true 
  })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
