import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {} from // /*EventPattern , */ MessagePattern,
// Payload,
'@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
