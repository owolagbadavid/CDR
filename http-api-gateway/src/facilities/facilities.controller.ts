import {
  Body,
  // Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  // NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { AppointmentDto } from './dtos/appointment.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

//   import { lastValueFrom } from 'rxjs';

@Controller('facilities')
export class FacilitiesController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // facility

  @Get()
  async getAllFacilities() {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'findAllFacilities' }, {}),
    );
    return response;
  }

  @Get(':id')
  async getFacilityById(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'findOneFacility' }, id),
    );
    return response;
  }

  @Post()
  async createFacility(@Body() createFacilityDto: CreateFacilityDto) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'createFacility' }, createFacilityDto),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  @Delete(':id')
  async deleteFacility(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'removeFacility' }, id),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  // staff
  @Get(':id/staff')
  async getAllStaff(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'getAllStaff' }, { facilityId: id }),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  // appointments

  // createAppointment

  @UseGuards(AuthGuard)
  @Post(':id/appointments')
  async createAppointment(
    @Body() createAppointmentDto: AppointmentDto,
    @GetUser() requestUser: any,
  ) {
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'createAppointment' },
        { createAppointmentDto, requestUser },
      ),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }
}
