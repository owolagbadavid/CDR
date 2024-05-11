import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/entities/facility.entity';

import { UsersService } from 'src/users/users.service';
import { Patient, Personnel } from 'src/entities';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, UsersService],
  imports: [TypeOrmModule.forFeature([Facility, Patient, Personnel])],
})
export class FacilitiesModule {}
