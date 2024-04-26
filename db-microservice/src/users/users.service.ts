import { Injectable } from '@nestjs/common';
import { CreatePatientDto, CreatePersonnelDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient, Personnel } from 'src/entities';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Personnel) private personnelRepo: Repository<Personnel>,
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

    return this.patientRepo.save(patient);
  }

  async createPersonnel(createPersonnelDto: CreatePersonnelDto) {
    const emailAlreadyExists = await this.findUserByEmail(
      createPersonnelDto.email,
    );

    if (emailAlreadyExists.user) {
      return { error: 'Email already exists', statusCode: 409 };
    }
    const isVerified = true;
    const verified = new Date();

    const details = { isVerified, verified };
    createPersonnelDto = { ...createPersonnelDto, ...details };
    const personnel = this.personnelRepo.create(createPersonnelDto);
    personnel.password = createPersonnelDto.password;
    console.log(personnel, 'personnel.passwordHash');
    return this.personnelRepo.save(personnel);
  }

  findPatientByEmail(email: string) {
    return this.patientRepo.findOneBy({ email });
  }

  findPersonnelByEmail(email: string) {
    return this.personnelRepo.findOneBy({ email });
  }

  async findUserById(userId: number) {
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

    return { error: 'User not found' };
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

    return { error: 'User not found' };
  }

  async updateUser(data: any) {
    const patient = await this.patientRepo.findOneBy({
      patientId: data.patientId,
    });

    console.log('patient', patient, data, 'data');
    if (patient) {
      const updatedPatient = await this.patientRepo.save({
        ...patient,
        ...data,
      });
      return { message: 'User updated', user: updatedPatient };
    }

    const personnel = await this.personnelRepo.findOneBy({
      personnelId: data.personnelId,
    });
    if (personnel) {
      const updatedPersonnel = await this.personnelRepo.save({
        ...personnel,
        ...data,
      });
      return { message: 'User updated', user: updatedPersonnel };
    }

    return { error: 'User not found', statusCode: 404 };
  }
}
