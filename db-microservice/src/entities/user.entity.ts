// Base User Entity

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Facility } from './facility.entity';
import { Appointment } from './appointment.entity';

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  OTHER = 'other',
}

@Entity()
export class User {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ default: true, type: 'boolean' })
  active: boolean;

  @Column({ nullable: true })
  gender: string;

  @Column({ name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telecom: string;

  @Column({ default: false, type: 'boolean' })
  deceased: boolean;

  @Column({ name: 'deceased_date', nullable: true })
  deceasedDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  communication: {
    language: string;
    preferred: boolean;
  };

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ nullable: true, name: 'password_token' })
  passwordToken: string | null;

  @Column({ nullable: true, name: 'password_token_expiration' })
  passwordTokenExpiration: Date | null;

  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @Column({ nullable: true, name: 'verification_token' })
  verificationToken: string | null;

  @Column({ nullable: true })
  verified: Date;

  //setter for password
  set password(password: string) {
    //hash password
    const salt = bcrypt.genSaltSync(10);
    this.passwordHash = bcrypt.hashSync(password, salt);
  }
}

@Entity({ name: 'patients' })
export class Patient extends User {
  @PrimaryGeneratedColumn('uuid', { name: 'patient_id' })
  patientId: string;

  @OneToMany('Appointment', 'patient')
  appointments: Appointment[];

  @Column({
    name: 'marital_status',
    type: 'enum',
    enum: MaritalStatus,
    default: MaritalStatus.OTHER,
  })
  maritalStatus: MaritalStatus;
}

// enum for personnel type
export enum PersonnelType {
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PHARMACIST = 'pharmacist',
  LAB_TECH = 'lab_tech',
  OTHER = 'other',
}

@Entity()
export class Personnel extends User {
  @PrimaryGeneratedColumn('uuid', { name: 'personnel_id' })
  personnelId: string;

  @ManyToOne('Facility', 'personnel')
  @JoinColumn({ name: 'facility_id' })
  facility: Facility;

  @Column({ name: 'facility_id', nullable: true })
  facilityId: number;

  @Column({ type: 'enum', enum: PersonnelType, default: PersonnelType.OTHER })
  type: PersonnelType;

  @ManyToMany('Appointment', 'personnel')
  appointments: Appointment[];
}
