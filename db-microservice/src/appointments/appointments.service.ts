import { Injectable } from '@nestjs/common';
import { AppointmentDto, UpdateAppointmentDto } from './dtos/appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Appointment,
  AppointmentStatus,
} from 'src/entities/appointment.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { FacilitiesService } from 'src/facilities/facilities.service';
import { Personnel } from 'src/entities';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    private usersService: UsersService,
    private facilitiesService: FacilitiesService,
  ) {}

  async createAppointment(appointmentDto: AppointmentDto, requestUser: any) {
    console.log(appointmentDto);

    const values = await Promise.all([
      this.usersService.findUserById(appointmentDto.patientId),
      this.facilitiesService.findOneById(appointmentDto.facilityId),
    ]);

    const [patient, facility] = values;

    console.log(values);

    if (!patient.user || !facility.data) {
      return {
        statusCode: 404,
        error: 'Patient, or facility not found',
      };
    }

    if (appointmentDto.previousAppointmentId) {
      const previousAppointment = await this.appointmentRepo.findOne({
        where: {
          appointmentId: appointmentDto.previousAppointmentId,
        },
      });

      if (!previousAppointment) {
        return {
          statusCode: 404,
          error: 'Previous appointment not found',
        };
      }
    }
    const personnel = await this.usersService.findUserById(
      requestUser.personnelId,
    );
    const appointment = this.appointmentRepo.create(appointmentDto);
    appointment.personnel = [];
    appointment.personnel.push(personnel.user as Personnel);
    await this.appointmentRepo.save(appointment);

    return {
      statusCode: 201,
      message: 'Appointment created successfully',
      data: appointment,
    };
  }

  async addPersonnelToAppointment(
    appointmentId: number,
    personnelId: string,
    // requestUser: any,
  ) {
    // await this.appointmentRepo
    //   .createQueryBuilder('appointment')
    //   .relation('personnel')
    //   .of(appointmentId)
    //   .add(personnelId);

    try {
      const appointment = await this.appointmentRepo.findOne({
        where: {
          appointmentId,
        },
        relations: ['personnel'],
      });

      const response = await this.usersService.findUserById(personnelId);
      appointment.personnel.push(response.user as Personnel);

      await this.appointmentRepo.save(appointment);

      return {
        statusCode: 201,
        message: 'Personnel added to appointment successfully',
        data: appointment,
      };
    } catch (error) {
      return {
        // unprocessable entity
        statusCode: 422,
        error: 'Could not add personnel to appointment',
      };
    }
  }

  async removePersonnelFromAppointment(
    appointmentId: number,
    personnelId: string,
    // requestUser: any,
  ) {
    // await this.appointmentRepo
    //   .createQueryBuilder('appointment')
    //   .relation('personnel')
    //   .of(appointmentId)
    //   .remove(personnelId);

    try {
      const appointment = await this.appointmentRepo.findOne({
        where: {
          appointmentId,
        },
        relations: ['personnel'],
      });

      appointment.personnel = appointment.personnel.filter(
        (personnel) => personnel.personnelId !== personnelId,
      );

      await this.appointmentRepo.save(appointment);

      return {
        statusCode: 200,
        message: 'Personnel removed from appointment successfully',
        data: appointment,
      };
    } catch (error) {
      return {
        // unprocessable entity
        statusCode: 422,
        error: 'Could not remove personnel from appointment',
      };
    }
  }

  updateAppointmentStatus(
    appointmentId: number,
    status: AppointmentStatus,
    // requestUser: any,
  ) {
    return this.appointmentRepo.update(appointmentId, { status });
  }

  updateAppointment(
    appointmentId: number,
    updateAppointmentDto: UpdateAppointmentDto,
    // requestUser: any,
  ) {
    return this.appointmentRepo.update(appointmentId, updateAppointmentDto);
  }
}
