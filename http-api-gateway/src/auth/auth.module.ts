import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { AuthService } from './auth.service';

@Module({
  imports: [NatsClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
