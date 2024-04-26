import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Patient, Personnel } from 'src/types/user';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { createHash } from 'crypto';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateToken(token: string) {
    const payload: { sub: number; email: string } = await this.jwt.verifyAsync(
      token,
      {
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return this.natsClient.send({ cmd: 'findUserById' }, payload.sub);
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
      this.natsClient.send({ cmd: 'findPatientByEmail' }, data.email),
    );

    console.log('user', user);
    if (user) {
      if (bcrypt.compareSync(data.password, user.passwordHash)) {
        const token = await this.signToken(user.patientId, user.email);
        return { user, token };
      }
    }
    return null;
  }

  async registerPersonnel(data: any) {
    return this.natsClient.send({ cmd: 'createPersonnel' }, data);
  }

  async loginPersonnel(data) {
    const user: Personnel = await lastValueFrom(
      this.natsClient.send({ cmd: 'findPersonnelByEmail' }, data.email),
    );
    if (user) {
      if (bcrypt.compareSync(data.password, user.passwordHash)) {
        const token = await this.signToken(user.personnelId, user.email);
        return { user, token };
      }
    }
    return null;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let response;
    const { token, email } = resetPasswordDto;
    let { password } = resetPasswordDto;

    const data = await lastValueFrom(
      this.natsClient.send({ cmd: 'findUserByEmail' }, email),
    );
    const user: Patient | Personnel = data.user;

    // const user1 = JSON.parse(`${user}`);

    // console.log('user1', user1);

    if (user) {
      const currentDate = new Date();

      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);

      if (
        user.passwordToken === createHash('md5').update(token).digest('hex') &&
        user.passwordTokenExpiration > currentDate
      ) {
        user.passwordHash = password;
        user.passwordToken = null;
        user.passwordTokenExpiration = null;
        response = await lastValueFrom(
          this.natsClient.send({ cmd: 'updateUser' }, user),
        );
      }

      // check if it is a new account
      else if (token === user.verificationToken && user.isVerified === false) {
        console.log('new account');
        user.isVerified = true;
        user.passwordHash = password;
        user.verificationToken = '';
        user.verified = new Date();
        response = await lastValueFrom(
          this.natsClient.send({ cmd: 'updateUser' }, user),
        );
      } else {
        return {
          statusCode: 400,
          error: 'Invalid token',
        };
      }
    }

    if (response.error) {
      return response;
    }
    // return after successful update
    return {
      statusCode: 200,
      message: 'Password successfully updated',
    };
  }
}
