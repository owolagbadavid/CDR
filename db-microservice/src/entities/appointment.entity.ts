import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Facility } from './facility.entity';
import { Patient } from './user.entity';

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
  patient: Patient;

  @ManyToOne('Facility', 'appointments')
  facility: Facility;

  @JoinColumn({ name: 'facility_id' })
  facilityId: number;

  @JoinColumn({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'appointment_date_time', default: new Date() })
  appointmentDateTime: Date;

  @Column({
    name: 'services_received',
    type: 'simple-array',
    default: ['check-up'],
  })
  servicesReceived: string[];

  @ManyToOne('Appointment', 'previousAppointment')
  previousAppointment: Appointment;

  @JoinColumn({ name: 'previous_appointment_id' })
  previousAppointmentId: number;

  @Column({ name: 'documentation', type: 'jsonb' })
  documentation: {
    type: string;
    url: string;
  };
}
