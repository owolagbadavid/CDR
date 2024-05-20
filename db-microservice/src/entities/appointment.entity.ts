import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Facility } from './facility.entity';
import { Patient, Personnel } from './user.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  MISSED = 'missed',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn({ name: 'appointment_id' })
  appointmentId: number;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne('Patient', 'appointments')
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne('Facility', 'appointments')
  @JoinColumn({ name: 'facility_id' })
  facility: Facility;

  @Column({ name: 'facility_id' })
  facilityId: number;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'appointment_date_time', default: new Date() })
  appointmentDateTime: Date;

  @Column({
    name: 'services_received',
    type: 'simple-array',
    default: [],
  })
  servicesReceived: string[];

  @ManyToOne('Appointment', 'previousAppointment')
  @JoinColumn({ name: 'previous_appointment_id' })
  previousAppointment: Appointment;

  @Column({ name: 'previous_appointment_id', nullable: true })
  previousAppointmentId: number;

  // documentation i.e lab results, x-ray images, etc, array of objects with type and url
  @Column({ type: 'jsonb', default: [] })
  documentation: {
    type: string;
    url: string;
  }[];

  // personnel i.e list of doctors, nurses, etc that can manage the appointment
  @ManyToMany('Personnel', 'appointments', { cascade: true })
  @JoinTable({
    name: 'appointment_personnel',
    joinColumn: { name: 'appointment_id' },
    inverseJoinColumn: { name: 'personnel_id' },
  })
  personnel: Personnel[];
}
