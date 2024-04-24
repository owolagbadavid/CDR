import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Patient, Personnel } from 'types/user';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateToken(token: string) {
    const payload: { userId: number; email: string } =
      await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });

    return this.natsClient.send(
      { cmd: 'findUserById' },
      { userId: payload.userId },
    );
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    //todo
    //!change to '1800s'
    //$
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });
    return token;
  }

  async registerPatient(data: any) {
    const patient = await lastValueFrom(
      this.natsClient.send({ cmd: 'createPatient' }, data),
    );

    //todo: send email to patient
    return patient;
  }

  async loginPatient(data) {
    const user: Patient = await lastValueFrom(
      this.natsClient.send({ cmd: 'findUserByEmail' }, data.email),
    );
    if (user) {
      if (user.passwordHash === data.password) {
        const token = await this.signToken(user.patientId, user.email);
        return { token };
      }
    }
    return null;
  }

  async registerPersonnel(data: any) {
    return this.natsClient.send({ cmd: 'createPersonnel' }, data);
  }

  async loginPersonnel(data) {
    const user: Personnel = await lastValueFrom(
      this.natsClient.send({ cmd: 'findUserByEmail' }, data.email),
    );
    if (user) {
      if (user.passwordHash === data.password) {
        const token = await this.signToken(user.personnelId, user.email);
        return { token };
      }
    }
    return null;
  }
}
