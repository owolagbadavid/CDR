import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
// import { UpdateFacilityDto } from './dto/update-facility.dto';

@Controller()
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @MessagePattern('createFacility')
  create(@Payload() createFacilityDto: CreateFacilityDto) {
    return this.facilitiesService.create(createFacilityDto);
  }

  @MessagePattern('findAllFacilities')
  findAll() {
    return this.facilitiesService.findAll();
  }

  @MessagePattern('findOneFacility')
  findOne(@Payload() id: number) {
    return this.facilitiesService.findOne(id);
  }

  // @MessagePattern('updateFacility')
  // update(@Payload() updateFacilityDto: UpdateFacilityDto) {
  //   return this.facilitiesService.update(
  //     updateFacilityDto.facilityId,
  //     updateFacilityDto,
  //   );
  // }

  @MessagePattern('removeFacility')
  remove(@Payload() id: number) {
    return this.facilitiesService.remove(id);
  }

  @MessagePattern('getAllStaff')
  getAllStaff(@Payload() data) {
    return this.facilitiesService.getAllStaff(data.facilityId, data.filter);
  }
}
