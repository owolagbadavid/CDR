import { Patient, Personnel } from '../entities';

import * as dotenv from 'dotenv';
import { Appointment } from 'src/entities/appointment.entity';
import { Facility } from 'src/entities/facility.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DATABASE,
  username: 'postgres',
  synchronize: true,
  entities: [Patient, Personnel, Facility, Appointment],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
