import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  //   UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor (@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJWTFromCookie(request);

    if (!token) return false;

    // check if token is valid
    const user = lastValueFrom(
      this.natsClient.send({ cmd: 'validateToken' }, { token }),
    );

    if (user) {
      request['user'] = user;
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
