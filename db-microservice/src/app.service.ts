import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient, Personnel, Appointment } from 'src/entities';
import { Repository } from 'typeorm';
import { Facility } from 'src/entities/facility.entity';
import * as data from 'src/db/data-source';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Personnel) private personnelRepo: Repository<Personnel>,
    @InjectRepository(Facility) private facilityRepo: Repository<Facility>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async deleteAllColumns() {
    if (!data.default.isInitialized) await data.default.initialize();
    await data.default.dropDatabase();
    // await data.default.initialize();
    await data.default.synchronize();

    // import queryrunner and delete all columns

    return 'All columns deleted';
  }
}
