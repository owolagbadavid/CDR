import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

// import { lastValueFrom } from 'rxjs';

// import { createHash } from 'crypto';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private config: ConfigService,
  ) {}
}
