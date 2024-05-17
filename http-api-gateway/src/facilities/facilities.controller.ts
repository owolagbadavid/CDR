import {
  Body,
  // Body,
  Controller,
  Delete,
  // FileTypeValidator,d
  Get,
  HttpException,
  Inject,
  MaxFileSizeValidator,
  // NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { AppointmentDto } from './dtos/appointment.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { v2 as cloudinary } from 'cloudinary';

import * as fs from 'node:fs/promises';
import * as path from 'path';

cloudinary.config({
  cloud_name: 'dfpby8w8f',
  api_key: '356238686251863',
  api_secret: 'vxMGvWpJuL84NsyFgS1AEv0qf10',
});

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

  // addPersonnelToAppointment
  @Post(':id/appointments/:appointmentId/personnel')
  async addPersonnelToAppointment(
    @Param('id') appointmentId: string,
    @Body('personnelId') personnelId: string,
  ) {
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'addPersonnelToAppointment' },
        { appointmentId, personnelId },
      ),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  // removePersonnelFromAppointment
  @Delete(':id/appointments/:appointmentId/personnel')
  async removePersonnelFromAppointment(
    @Param('id') appointmentId: string,
    @Body('personnelId') personnelId: string,
  ) {
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'removePersonnelFromAppointment' },
        { appointmentId, personnelId },
      ),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  // updateAppointment
  @Patch(':id/appointments/:appointmentId')
  async updateAppointment(
    @Param('id') appointmentId: string,
    @Body() updateAppointmentDto: AppointmentDto,
  ) {
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'updateAppointment' },
        { appointmentId, updateAppointmentDto },
      ),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  // updateAppointmentStatus
  @Patch(':id/appointments/:appointmentId/status')
  async updateAppointmentStatus(
    @Param('id') appointmentId: string,
    @Body('status') status: string,
  ) {
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'updateAppointmentStatus' },
        { appointmentId, status },
      ),
    );

    if (response.error) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  // upploadDocument
  @UseInterceptors(FileInterceptor('doc'))
  @Post(':id/appointments/:appointmentId/documents')
  // google drive api
  async uploadDocument(
    @Param('id') facilityId: string,
    @Param('appointmentId') appointmentId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: 'jpg' }),
        ],
      }),
    )
    doc: any,
    //Express.Multer.File,
  ) {
    console.log(doc);
    // get file path

    const tempFilePath = path.join(doc.originalname);
    await fs.writeFile(tempFilePath, doc.buffer);

    // Upload the temporary file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: `cdr\/f-${facilityId}\/A-${appointmentId}-doc`,
    });

    // Clean up the temporary file
    await fs.unlink(tempFilePath);

    return {
      public_id: result.public_id,
      url: result.secure_url,
      message: 'Document uploaded successfully',
    };
  }
}
