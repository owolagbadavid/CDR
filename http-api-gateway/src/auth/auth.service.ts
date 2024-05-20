import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const reponse = await lastValueFrom(
      this.natsClient.send({ cmd: 'resetPassword' }, resetPasswordDto),
    );

    if (reponse.error) {
      throw new HttpException(reponse.error, reponse.statusCode);
    }

    return reponse;
  }

  // forgot password
  async forgotPassword(email: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'forgotPassword' }, email),
    );

    if (response.error) {
      throw new HttpException(response.error, response.statusCode);
    }

    return response;
  }
}
