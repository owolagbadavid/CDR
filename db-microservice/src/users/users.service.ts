import { Injectable } from '@nestjs/common';
import { CreatePatientDto, CreatePersonnelDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient, Personnel } from 'src/entities';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Facility } from 'src/entities/facility.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Personnel) private personnelRepo: Repository<Personnel>,
    @InjectRepository(Facility) private facilityRepo: Repository<Facility>,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto) {
    const emailAlreadyExists = await this.findUserByEmail(
      createPatientDto.email,
    );

    if (emailAlreadyExists.user) {
      return { error: 'Email already exists', statusCode: 409 };
    }

    const verificationToken = randomBytes(40).toString('hex');
    const patient = this.patientRepo.create({
      ...createPatientDto,
      verificationToken,
    });

    await this.patientRepo.save(patient);
    return {
      message: 'Personnel registered successfully',
      data: patient,
      statusCode: 201,
    };
  }

  async createPersonnel(createPersonnelDto: CreatePersonnelDto) {
    const emailAlreadyExists = await this.findUserByEmail(
      createPersonnelDto.email,
    );

    if (emailAlreadyExists.user) {
      return { error: 'Email already exists', statusCode: 409 };
    }

    // check if facility exists

    const facility = await this.facilityRepo.findOne({
      where: {
        facilityId: createPersonnelDto.facilityId,
      },
    });

    if (!facility) {
      return { error: 'Facility does not exist', statusCode: 404 };
    }

    const isVerified = true;
    const verified = new Date();

    const details = { isVerified, verified };
    createPersonnelDto = { ...createPersonnelDto, ...details };
    let personnel = this.personnelRepo.create(createPersonnelDto);
    personnel.password = createPersonnelDto.password;
    console.log(personnel, 'personnel.passwordHash');
    personnel = await this.personnelRepo.save(personnel);
    return {
      message: 'Personnel registered successfully',
      data: personnel,
      statusCode: 201,
    };
  }

  findPatientByEmail(email: string) {
    return this.patientRepo.findOneBy({ email });
  }

  findPersonnelByEmail(email: string) {
    return this.personnelRepo.findOneBy({ email });
  }

  async findUserById(userId: string) {
    try {
      const patient = await this.patientRepo.findOneBy({ patientId: userId });
      if (patient)
        return {
          message: 'User found',
          user: patient,
        };
      const personnel = await this.personnelRepo.findOneBy({
        personnelId: userId,
      });

      if (personnel) return { message: 'User found', user: personnel };

      return { error: 'User not found', statusCode: 404 };
    } catch (error) {
      console.log(error);
    }
  }

  async findUserByEmail(email: string) {
    const patient = await this.patientRepo.findOneBy({ email });
    if (patient)
      return {
        message: 'User found',
        user: patient,
      };
    const personnel = await this.personnelRepo.findOneBy({ email });

    if (personnel) return { message: 'User found', user: personnel };

    return { error: 'User not found', statusCode: 404 };
  }

  async getPatientById(id: string) {
    try {
      const patient = await this.patientRepo.findOneBy({ patientId: id });
      if (patient)
        return { message: 'User found', user: patient, statusCode: 200 };
      return { error: 'User not found', statusCode: 404 };
    } catch (error) {
      console.log(error.code);
      if (error.code === '22P02') {
        return { error: 'Invalid uuid', statusCode: 400 };
      }
    }
  }

  async getPersonnelById(id: string) {
    try {
      const personnel = await this.personnelRepo.findOneBy({ personnelId: id });
      if (personnel)
        return { message: 'User found', user: personnel, statusCode: 200 };
      return { error: 'User not found', statusCode: 404 };
    } catch (error) {
      console.log(error.code);
      if (error.code === '22P02') {
        return { error: 'Invalid uuid', mstatusCode: 400 };
      }
    }
  }

  async updateUser(data: any) {
    const patientResponse = await this.getPatientById(data.patientId);

    if (patientResponse.error) return patientResponse;

    const patient = patientResponse.user;

    if (patient) {
      const updatedPatient = await this.patientRepo.save({
        ...patient,
        ...data,
      });
      return { message: 'User updated', user: updatedPatient };
    }

    const personnelResponse = await this.getPersonnelById(data.personnelId);

    if (personnelResponse.error) return personnelResponse;

    const personnel = personnelResponse.user;

    if (personnel) {
      const updatedPersonnel = await this.personnelRepo.save({
        ...personnel,
        ...data,
      });
      return { message: 'User updated', user: updatedPersonnel };
    }

    return { error: 'User not found', statusCode: 404 };
  }

  async deleteAllPatients() {
    // dont use clear() method to delete all records
    return this.patientRepo.delete({});
  }

  async deleteAllPersonnel() {
    // dont use clear() method to delete all records
    return this.personnelRepo.delete({});
  }

  // get all personnel with optional query params and pagination
  async getAllPersonnel(query: any) {
    const { page = 1, limit = 10, ...filters } = query;
    const personnel = await this.personnelRepo.find({
      take: limit,
      skip: (page - 1) * limit,
      where: { ...filters },
    });
    return personnel;
  }

  // get all patients with optional query params and pagination
  async getAllPatients(query?: any) {
    try {
      const page = 1,
        limit = 10;
      console.log(page);

      const patients = await this.patientRepo.find({
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'Patients retrieved successfully',
        data: patients,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
