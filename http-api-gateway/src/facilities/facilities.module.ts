import { Module } from '@nestjs/common';
import { FacilitiesController } from './facilities.controller';

import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  controllers: [FacilitiesController],
  providers: [],
  imports: [NatsClientModule],
})
export class FacilitiesModule {}
