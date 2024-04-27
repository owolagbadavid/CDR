import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Personnel } from './user.entity';

export enum FacilityType {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  PHARMACY = 'pharmacy',
  LAB = 'lab',
  OTHER = 'other',
}

export class Facility {
  // unique identifier
  @PrimaryGeneratedColumn({ name: 'facility_id' })
  facilityId: number;

  // hospital, clinic, pharmacy, lab, etc
  @Column({ type: 'enum', enum: FacilityType, default: FacilityType.OTHER })
  type: FacilityType;

  // name of the facility
  @Column({ type: 'varchar', length: 100 })
  name: string;

  // address of the facility
  @Column({ type: 'varchar', length: 200 })
  address: string;

  // phone number of the facility
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  // email of the facility
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  // website of the facility
  @Column({ type: 'varchar', length: 100 })
  website: string;

  // facility description
  @Column({ type: 'text' })
  description: string;

  // personnel working in the facility
  @OneToMany('Personnel', 'facility')
  personnel: Personnel[];
}
