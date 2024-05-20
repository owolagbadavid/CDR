import { Controller } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentDto, UpdateAppointmentDto } from './dtos/appointment.dto';
import { AppointmentStatus } from 'src/entities/appointment.entity';

@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @MessagePattern('createAppointment')
  createAppointment(
    @Payload() data: { createAppointmentDto: AppointmentDto; requestUser: any },
  ) {
    return this.appointmentsService.createAppointment(
      data.createAppointmentDto,
      data.requestUser,
    );
  }

  // addPersonnelToAppointment
  @MessagePattern('addPersonnelToAppointment')
  addPersonnelToAppointment(
    @Payload() data: { appointmentId: number; personnelId: string },
  ) {
    return this.appointmentsService.addPersonnelToAppointment(
      data.appointmentId,
      data.personnelId,
    );
  }

  // removePersonnelFromAppointment
  @MessagePattern('removePersonnelFromAppointment')
  removePersonnelFromAppointment(
    @Payload() data: { appointmentId: number; personnelId: string },
  ) {
    return this.appointmentsService.removePersonnelFromAppointment(
      data.appointmentId,
      data.personnelId,
    );
  }

  // updateAppointmentStatus
  @MessagePattern('updateAppointmentStatus')
  updateAppointmentStatus(
    @Payload()
    data: {
      appointmentId: number;
      status: AppointmentStatus;
    },
  ) {
    return this.appointmentsService.updateAppointmentStatus(
      data.appointmentId,
      data.status,
    );
  }

  // updateAppointment
  @MessagePattern('updateAppointment')
  async updateAppointment(
    @Payload()
    data: {
      appointmentId: number;
      appointmentDto: UpdateAppointmentDto;
    },
  ) {
    const appointment = await this.appointmentsService.updateAppointment(
      data.appointmentId,
      data.appointmentDto,
    );

    return {
      statusCode: 200,
      message: 'Appointment updated successfully',
      data: appointment,
    };
  }

  @MessagePattern('getOneAppointment')
  async getOneAppointment(@Payload() appointmentId: number) {
    const appointment =
      await this.appointmentsService.getOneAppointment(appointmentId);

    if (appointment)
      return {
        message: 'Appointment Found Successfully',
        data: appointment,
        statusCode: 200,
      };

    return {
      error: 'Appointment Not Found',
      statusCode: 404,
    };
  }

  @MessagePattern('getAllAppointments')
  async getAllAppointments(@Payload() filterDto: any) {
    console.log('herefff');

    const appointments =
      await this.appointmentsService.getAllAppointments(filterDto);

    return {
      message: 'Appointments Found Succesfully',
      statusCode: 200,
      data: appointments,
    };
  }

  @MessagePattern('getPatientAppointments')
  async getPatientAppointments(@Payload() patientId: string) {
    return this.appointmentsService.getPatientAppointments(patientId);
  }
}
