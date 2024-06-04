import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/data-source';
import { FacilitiesModule } from './facilities/facilities.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Patient, Personnel, Facility, Appointment } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    FacilitiesModule,
    AppointmentsModule,
    TypeOrmModule.forFeature([Patient, Personnel, Facility, Appointment]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
