import {
  // Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  // Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await lastValueFrom(
      this.natsClient.send({ cmd: 'getUserById' }, { userId: id }),
    );

    if (user) return user;
    throw new NotFoundException('User Not Found!');
  }
}
