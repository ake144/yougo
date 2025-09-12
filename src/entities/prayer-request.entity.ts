import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';


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
    type: 'text', 
    nullable: false 
  })
  prayerRequest: string;

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
