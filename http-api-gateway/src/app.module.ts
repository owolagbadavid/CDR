import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FacilitiesModule } from './facilities/facilities.module';

@Module({
  imports: [AuthModule, UsersModule, FacilitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
