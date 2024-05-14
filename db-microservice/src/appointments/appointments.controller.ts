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
}
