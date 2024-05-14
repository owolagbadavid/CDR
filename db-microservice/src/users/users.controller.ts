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
  findUserById(@Payload() userId: string) {
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

  @MessagePattern({ cmd: 'getPatientById' })
  getPatientById(@Payload() id: string) {
    return this.usersService.getPatientById(id);
  }

  @MessagePattern({ cmd: 'getPersonnelById' })
  getPersonnelById(@Payload() id: string) {
    return this.usersService.getPersonnelById(id);
  }

  @MessagePattern({ cmd: 'updateUser' })
  updateUser(@Payload() data: any) {
    return this.usersService.updateUser(data);
  }

  @MessagePattern({ cmd: 'deleteAllPatients' })
  async deleteAllPatients() {
    console.log('deleteAllPatients');
    await this.usersService.deleteAllPatients();
    return { message: 'All patients deleted successfully' };
  }

  @MessagePattern({ cmd: 'deleteAllPersonnel' })
  async deleteAllPersonnel() {
    console.log('deleteAllPersonnel');
    await this.usersService.deleteAllPersonnel();
    return { message: 'All personnel deleted successfully' };
  }

  // get all patients
  @MessagePattern({ cmd: 'getAllPatients' })
  async getAllPatients() {
    return this.usersService.getAllPatients();
  }
}
