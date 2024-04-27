import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/data-source';
import { FacilitiesModule } from './facilities/facilities.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, FacilitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
