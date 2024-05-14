import { Module, forwardRef } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/entities/facility.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  imports: [
    TypeOrmModule.forFeature([Facility]),
    forwardRef(() => UsersModule),
  ],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}
