import { Injectable } from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
// import { UpdateFacilityDto } from './dto/update-facility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facility } from 'src/entities/facility.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Facility) private facilityRepo: Repository<Facility>,
    private usersService: UsersService,
  ) {}
  async create(createFacilityDto: CreateFacilityDto) {
    const emailAlreadyExists = await this.facilityRepo.findOneBy({
      email: createFacilityDto.email,
    });

    if (emailAlreadyExists) {
      return {
        statusCode: 400,
        error: 'Email already exists',
      };
    }

    const facility = this.facilityRepo.create(createFacilityDto);
    await this.facilityRepo.save(facility);

    return {
      statusCode: 201,
      message: 'Facility created successfully',
      data: facility,
    };
  }

  async findAll() {
    const facilities = await this.facilityRepo.find();

    return {
      statusCode: 200,
      message: 'Facilities retrieved successfully',
      data: facilities,
    };
  }

  async findOne(id: number) {
    const facility = await this.facilityRepo.findOneBy({ facilityId: id });

    if (!facility) {
      return {
        statusCode: 404,
        error: 'Facility not found',
      };
    }

    return {
      statusCode: 200,
      message: 'Facility retrieved successfully',
      data: facility,
    };
  }

  // update(id: number, updateFacilityDto: UpdateFacilityDto) {
  //   return `This action updates a #${id} facility`;
  // }

  async remove(id: number) {
    const facility = await this.facilityRepo.findOneBy({ facilityId: id });

    if (!facility) {
      return {
        statusCode: 404,
        error: 'Facility not found',
      };
    }

    await this.facilityRepo.remove(facility);

    return {
      statusCode: 200,
      message: 'Facility deleted successfully',
    };
  }

  getAllStaff(facilityId: number, filter) {
    const query = {
      facilityId,
      ...filter,
    };
    return this.usersService.getAllPersonnel(query);
  }
}
