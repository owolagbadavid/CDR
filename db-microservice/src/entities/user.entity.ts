// Base User Entity

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

@Entity()
export class Patient extends User {
  @PrimaryGeneratedColumn('uuid', { name: 'patient_id' })
  patientId: number;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;
}

@Entity()
export class Personnel extends User {
  @PrimaryGeneratedColumn('uuid', { name: 'personnel_id' })
  personnelId: number;
}
