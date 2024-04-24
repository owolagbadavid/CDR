// Base User Entity

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @Column({ name: 'first_name' })
  firtstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  //setter for password
  set password(password: string) {
    //hash password
    const salt = bcrypt.genSaltSync(10);
    this.passwordHash = bcrypt.hashSync(password, salt);
  }
}

export class Patient extends User {
  @PrimaryGeneratedColumn({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;
}

export class Personnel extends User {
  @PrimaryGeneratedColumn({ name: 'personnel_id' })
  personnelId: number;
}
