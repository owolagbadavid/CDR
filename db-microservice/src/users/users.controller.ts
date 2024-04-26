import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreatePatientDto, CreatePersonnelDto } from './dto/create-user.dto';
// import { Patient, Personnel } from 'src/entities';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'createPatient' })
  async createPatient(@Payload() createPatientDto: CreatePatientDto) {
    return this.usersService.createPatient(createPatientDto);
  }

  @MessagePattern({ cmd: 'createPersonnel' })
  async createPersonnel(@Payload() createPersonnelDto: CreatePersonnelDto) {
    return this.usersService.createPersonnel(createPersonnelDto);
  }

  @MessagePattern({ cmd: 'findPatientByEmail' })
  findPatientByEmail(@Payload() email: string) {
    return this.usersService.findPatientByEmail(email);
  }

  @MessagePattern({ cmd: 'findUserById' })
  findUserById(@Payload() userId: number) {
    return this.usersService.findUserById(userId);
  }

  @MessagePattern({ cmd: 'findPersonnelByEmail' })
  findPersonnelByEmail(@Payload() email: string) {
    return this.usersService.findPersonnelByEmail(email);
  }

  @MessagePattern({ cmd: 'findUserByEmail' })
  findUserByEmail(@Payload() email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @MessagePattern({ cmd: 'updateUser' })
  updateUser(@Payload() data: any) {
    return this.usersService.updateUser(data);
  }
}
