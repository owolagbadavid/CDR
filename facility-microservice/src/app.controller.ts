import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  MessagePattern,
  Payload, // /*EventPattern , */ MessagePattern,
  // Payload,
} from '@nestjs/microservices';
import { CreateFacilityDto } from './dtos/create-facility.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'ping' })
  getHello(): string {
    return 'Pong!';
  }

  // Facility

  @MessagePattern({ cmd: 'createFacility' })
  create(@Payload() createFacilityDto: CreateFacilityDto) {
    return this.appService.create(createFacilityDto);
  }

  @MessagePattern({ cmd: 'findAllFacilities' })
  findAll() {
    return this.appService.findAll();
  }

  @MessagePattern({ cmd: 'findOneFacility' })
  findOne(@Payload() id: number) {
    return this.appService.findOneById(id);
  }

  // @MessagePattern('updateFacility')
  // update(@Payload() updateFacilityDto: UpdateFacilityDto) {
  //   return this.facilitiesService.update(
  //     updateFacilityDto.facilityId,
  //     updateFacilityDto,
  //   );
  // }

  @MessagePattern({ cmd: 'removeFacility' })
  remove(@Payload() id: number) {
    return this.appService.remove(id);
  }

  // Staff

  @MessagePattern({ cmd: 'getAllStaff' })
  getAllStaff(@Payload() data) {
    return this.appService.getAllStaff(data.facilityId, data.filter);
  }

  // Appointments

  @MessagePattern({ cmd: 'createAppointment' })
  createAppointment(@Payload() data) {
    return this.appService.createAppointment(data);
  }

  @MessagePattern({ cmd: 'addPersonnelToAppointment' })
  addPersonnelToAppointment(@Payload() data) {
    return this.appService.addPersonnelToAppointment(data);
  }

  @MessagePattern({ cmd: 'removePersonnelFromAppointment' })
  removePersonnelFromAppointment(@Payload() data) {
    return this.appService.removePersonnelFromAppointment(data);
  }

  @MessagePattern({ cmd: 'updateAppointmentStatus' })
  updateAppointmentStatus(@Payload() data) {
    return this.appService.updateAppointmentStatus(data);
  }

  @MessagePattern({ cmd: 'updateAppointment' })
  updateAppointment(@Payload() data) {
    return this.appService.updateAppointment(data);
  }

  @MessagePattern({ cmd: 'getOneAppointment' })
  getOneAppointment(@Payload() appointmentId: number) {
    return this.appService.getOneAppointment(appointmentId);
  }

  @MessagePattern({ cmd: 'getAllAppointments' })
  getAllAppointments(@Payload() filterDto: any) {
    console.log(filterDto, 'in controller');
    this.appService.getAllAppointments(filterDto);
  }

  // get patient appointments
  @MessagePattern({ cmd: 'getPatientAppointments' })
  getPatientAppointments(@Payload() patientId: number) {
    return this.appService.getPatientAppointments(patientId);
  }
}
