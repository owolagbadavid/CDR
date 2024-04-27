// Base User Entity

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Facility } from './facility.entity';

@Entity()
export class User {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

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

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;
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
  facility: Facility;

  @JoinColumn({ name: 'facility_id' })
  facilityId: string;

  @Column({ type: 'enum', enum: PersonnelType, default: PersonnelType.OTHER })
  type: PersonnelType;
}
