import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Personnel } from './user.entity';
import { Appointment } from './appointment.entity';

export enum FacilityType {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  PHARMACY = 'pharmacy',
  LAB = 'lab',
  OTHER = 'other',
}

@Entity('facilities')
export class Facility {
  // unique identifier
  @PrimaryGeneratedColumn({ name: 'facility_id' })
  facilityId: number;

  @Column({ default: true })
  active: boolean;

  // hospital, clinic, pharmacy, lab, etc
  @Column({ type: 'enum', enum: FacilityType, default: FacilityType.OTHER })
  type: FacilityType;

  // name of the facility
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'simple-array', default: [] })
  alias: string[];

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

  @ManyToOne('Facility', 'facilities')
  @JoinColumn({ name: 'part_of' })
  partOf: Facility;

  @Column({ name: 'part_of', nullable: true })
  partOfId: number;

  @OneToMany('Facility', 'partOf')
  facilities: Facility[];

  // personnel working in the facility
  @OneToMany('Personnel', 'facility')
  personnel: Personnel[];

  @OneToMany('Appointment', 'facility')
  appointments: Appointment[];

  @Column({ type: 'simple-json', nullable: true })
  qualification: {
    name: string;
    start: Date;
    end: Date;
    description: string;
    issuer: string;
  };
}
