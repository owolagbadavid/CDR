import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsClientModule } from './nats-client/nats-client.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [NatsClientModule, JwtModule.register({})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
