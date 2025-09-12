import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

@Entity('User')
@Index(['email'], { unique: true, where: 'email IS NOT NULL' })
@Index(['phone'], { unique: true, where: 'phone IS NOT NULL' })
export class User {
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
    nullable: true,
    unique: true 
  })
  email: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    nullable: true,
    unique: true 
  })
  phone: string;

  @Column({ 
    type: 'varchar', 
    length: 500, 
    nullable: true 
  })
  profilePic: string;

  @Column({ 
    type: 'int', 
    nullable: true,
    unsigned: true 
  })
  age: number;

  @Column({ 
    type: 'enum', 
    enum: MaritalStatus, 
    nullable: true 
  })
  maritalStatus: MaritalStatus;

  @Column({ 
    type: 'enum', 
    enum: Gender, 
    nullable: true 
  })
  sex: Gender;

  @Column({ 
    type: 'enum', 
    enum: Role, 
    default: Role.USER 
  })
  role: Role;

  @Column({ 
    type: 'text', 
    nullable: true 
  })
  address: string;

  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true 
  })
  occupation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 