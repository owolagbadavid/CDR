import { Controller } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @MessagePattern('createAppointment')
  createAppointment(@Payload() appointment: any) {
    console.log('createAppointment');
  }
}
