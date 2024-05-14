import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { UsersModule } from 'src/users/users.module';
import { FacilitiesModule } from 'src/facilities/facilities.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    UsersModule,
    FacilitiesModule,
  ],
})
export class AppointmentsModule {}
