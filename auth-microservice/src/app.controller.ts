import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  /*EventPattern , */ MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'validateToken' })
  validateToken(@Payload() token: string) {
    return this.appService.validateToken(token);
  }

  @MessagePattern({ cmd: 'registerPatient' })
  registerUser(@Payload() data: any) {
    return this.appService.registerPatient(data);
  }

  @MessagePattern({ cmd: 'loginPatient' })
  loginUser(@Payload() data: any) {
    return this.appService.loginPatient(data);
  }

  @MessagePattern({ cmd: 'registerPersonnel' })
  registerPersonnel(@Payload() data: any) {
    return this.appService.registerPersonnel(data);
  }

  @MessagePattern({ cmd: 'loginPersonnel' })
  loginPersonnel(@Payload() data: any) {
    return this.appService.loginPersonnel(data);
  }

  @MessagePattern({ cmd: 'resetPassword' })
  resetPassword(@Payload() data: any) {
    return this.appService.resetPassword(data);
  }
}
