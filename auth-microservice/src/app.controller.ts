import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'validateToken' })
  validateToken(@Payload() token: string) {
    return this.appService.validateToken(token);
  }

  @EventPattern({ cmd: 'registerPatient' })
  registerUser(@Payload() data: any) {
    return this.appService.registerPatient(data);
  }

  @EventPattern({ cmd: 'loginPatient' })
  loginUser(@Payload() data: any) {
    return this.appService.loginPatient(data);
  }

  @EventPattern({ cmd: 'registerPersonnel' })
  registerPersonnel(@Payload() data: any) {
    return this.appService.registerPersonnel(data);
  }

  @EventPattern({ cmd: 'loginPersonnel' })
  loginPersonnel(@Payload() data: any) {
    return this.appService.loginPersonnel(data);
  }
}
