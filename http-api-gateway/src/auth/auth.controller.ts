import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('patientRegister')
  register(@Body() createPatientDto) {
    console.log(createPatientDto);
    return this.natsClient.send({ cmd: 'registerPatient' }, createPatientDto);
  }

  @Post('patientLogin')
  login(@Body() loginDto) {
    console.log(loginDto);
    return this.natsClient.send({ cmd: 'loginPatient' }, loginDto);
  }

  @Post('personnelRegister')
  personnelRegister(@Body() createPersonnelDto) {
    console.log(createPersonnelDto);
    return this.natsClient.send(
      { cmd: 'registerPersonnel' },
      createPersonnelDto,
    );
  }

  @Post('personnelLogin')
  personnelLogin(@Body() loginDto) {
    console.log(loginDto);
    return this.natsClient.send({ cmd: 'loginPersonnel' }, loginDto);
  }
}
