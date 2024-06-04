import {
  // Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  // NotFoundException,
  Param,
  // Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom } from 'rxjs';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Get('patients/:id')
  async getUserById(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'getPatientById' }, id),
    );

    if (response.error) throw new HttpException(response, response.statusCode);
    return response;
  }

  @Get('personnel/:id')
  async getPersonnelById(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'getPersonnelById' }, id),
    );

    if (response.error)
      throw new HttpException(response.error, response.statusCode);
    return response;
  }

  @Delete('patients')
  async deleteAllPatients() {
    return this.natsClient.send({ cmd: 'deleteAllPatients' }, {});
  }

  @Delete('personnel')
  async deleteAllPersonnel() {
    return this.natsClient.send({ cmd: 'deleteAllPersonnel' }, {});
  }

  @Delete('all')
  async deleteAll() {
    return this.natsClient.send('deleteAllColumns', {});
  }

  @Get('patients')
  async getAllPatients() {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'getAllPatients' }, {}),
    );
    return response;
  }

  // get patient appointments
  @Get('patients/:id/appointments')
  async getPatientAppointments(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'getPatientAppointments' }, id),
    );

    if (response.error) throw new HttpException(response, response.statusCode);
    return response;
  }
}
