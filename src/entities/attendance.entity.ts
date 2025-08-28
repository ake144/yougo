import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('Attendance')
@Unique(['userId', 'date'])
@Index(['userId'])
@Index(['date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
    type: 'date',
    nullable: false 
  })
  date: Date;

  @Column({ 
    type: 'boolean', 
    default: true,
    nullable: false 
  })
  isPresent: boolean;

  @Column({ 
    type: 'varchar', 
    length: 36,
    nullable: false 
  })
  userId: string;

  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true 
  })
  serviceType: string;

  @Column({ 
    type: 'text', 
    nullable: true 
  })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.attendance, { 
    onDelete: 'CASCADE',
    nullable: false 
  })
  @JoinColumn({ name: 'userId' })
  user: User;
} 