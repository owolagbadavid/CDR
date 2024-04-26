import { Patient, Personnel } from '../entities';

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DATABASE,
  username: 'postgres',
  synchronize: true,
  entities: [Patient, Personnel],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
