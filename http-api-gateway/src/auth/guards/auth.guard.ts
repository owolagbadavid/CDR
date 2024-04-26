import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  //   UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor (@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJWTFromCookie(request);

    if (!token) return false;

    // check if token is valid
    const reponse = await lastValueFrom(
      this.natsClient.send({ cmd: 'validateToken' }, token),
    );

    if (reponse.user) {
      request['user'] = reponse.user;
      return true;
    }

    return false;
  }

  private extractJWTFromCookie(req: Request): string | null {
    if (req.signedCookies && req.signedCookies.token) {
      return req.signedCookies.token;
    }
    return null;
  }
}
