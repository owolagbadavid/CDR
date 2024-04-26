import {
  Body,
  ConflictException,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreatePatientDto,
  CreatePersonnelDto,
} from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { lastValueFrom } from 'rxjs';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';

// import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('patientRegister')
  async register(@Body() createPatientDto: CreatePatientDto) {
    console.log('response');
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'registerPatient' }, createPatientDto),
    );

    if (response.error) {
      throw new ConflictException(response.error);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Personnel registered successfully',
      data: response,
    };
  }

  @Post('patientLogin')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(loginDto);
    const { token, user } = await lastValueFrom(
      this.natsClient.send({ cmd: 'loginPatient' }, loginDto),
    );

    console.log(token, user);
    if (!token) throw new UnauthorizedException('Invalid credentials');

    const longerExp = 1000 * 60 * 60; // 2 hours
    //!change to '1800s'

    // attach cookie to response
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      signed: true,
      expires: new Date(Date.now() + longerExp),
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'login successful',
      data: user,
    };
  }

  @Post('personnelRegister')
  async personnelRegister(@Body() createPersonnelDto: CreatePersonnelDto) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'registerPersonnel' }, createPersonnelDto),
    );

    if (response.error) {
      throw new ConflictException(response.error);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Personnel registered successfully',
      data: response,
    };
  }

  @Post('personnelLogin')
  async personnelLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(loginDto);
    const result = await lastValueFrom(
      this.natsClient.send({ cmd: 'loginPersonnel' }, loginDto),
    );

    if (!result) throw new UnauthorizedException('Invalid credentials');

    const { token, user } = result;
    console.log(token, user);

    const longerExp = 1000 * 60 * 60; // 2 hours
    //!change to '1800s'

    // attach cookie to response
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      signed: true,
      expires: new Date(Date.now() + longerExp),
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'login successful',
      data: user,
    };
  }

  @Delete('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // destroy cookie
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      signed: true,
      expires: new Date(),
    });

    // logout user
    return {
      statusCode: HttpStatus.OK,
      message: 'logout successful',
    };
  }

  @Post('resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
