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
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'createPatient' }, data),
    );

    if (response.error) {
      return response;
    }
    console.log('response', response);
    response.data = (({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordToken,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordTokenExpiration,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //! verificationToken,
      ...rest
    }) => rest)(response.data);

    //todo: send email to patient
    return response;
  }

  async loginPatient(data) {
    let user: Patient = await lastValueFrom(
      this.natsClient.send({ cmd: 'findPatientByEmail' }, data.email),
    );

    if (user) {
      console.log(data.password, user.passwordHash);
      if (!user.isVerified)
        return { error: 'Account not verified', statusCode: 401 };

      if (bcrypt.compareSync(data.password, user.passwordHash)) {
        const token = await this.signToken(user.patientId, user.email);
        user = (({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          passwordHash,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          passwordToken,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          passwordTokenExpiration,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          verificationToken,
          ...rest
        }) => rest)(user);
        return {
          message: 'Login Successful',
          data: { user, token },
          statusCode: 201,
        };
      }
    }
    return { error: 'Invalid credentials', statusCode: 401 };
  }

  async registerPersonnel(data: any) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'createPersonnel' }, data),
    );

    if (response.error) {
      return response;
    }

    response.data = (({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordToken,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordTokenExpiration,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      verificationToken,
      ...rest
    }) => rest)(response.data);

    return response;
  }

  async loginPersonnel(data) {
    let user: Personnel = await lastValueFrom(
      this.natsClient.send({ cmd: 'findPersonnelByEmail' }, data.email),
    );
    if (user) {
      console.log('user', user);
      if (bcrypt.compareSync(data.password, user.passwordHash)) {
        const token = await this.signToken(user.personnelId, user.email);
        user = (({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          passwordHash,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          passwordToken,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          passwordTokenExpiration,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          verificationToken,
          ...rest
        }) => rest)(user);

        return {
          message: 'Login Successful',
          data: { user, token },
          statusCode: 201,
        };
      }
    }
    return { error: 'Invalid credentials', statusCode: 401 };
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
