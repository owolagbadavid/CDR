import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

// import { lastValueFrom } from 'rxjs';

// import { createHash } from 'crypto';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private config: ConfigService,
  ) {}

  // Facility

  async create(createFacilityDto: any) {
    return this.natsClient.send('createFacility', createFacilityDto);
  }

  async findAll() {
    return this.natsClient.send('findAllFacilities', {});
  }

  async findOneById(id: number) {
    return this.natsClient.send('findOneFacility', id);
  }

  async remove(id: number) {
    return this.natsClient.send('removeFacility', id);
  }

  // Staff

  async getAllStaff(facilityId: number, filter: any) {
    return this.natsClient.send('getAllStaff', { facilityId, filter });
  }

  // Appointments

  async createAppointment(data: any) {
    return this.natsClient.send('createAppointment', data);
  }

  async addPersonnelToAppointment(data: any) {
    return this.natsClient.send('addPersonnelToAppointment', data);
  }

  async removePersonnelFromAppointment(data: any) {
    return this.natsClient.send('removePersonnelFromAppointment', data);
  }

  async updateAppointmentStatus(data: any) {
    return this.natsClient.send('updateAppointmentStatus', data);
  }

  async updateAppointment(data: any) {
    return this.natsClient.send('updateAppointment', data);
  }
}
