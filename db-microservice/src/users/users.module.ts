import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Personnel } from 'src/entities';
import { FacilitiesModule } from 'src/facilities/facilities.module';
import { Facility } from 'src/entities/facility.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([Patient, Personnel, Facility]),
    forwardRef(() => FacilitiesModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
