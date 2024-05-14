import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class AppointmentDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  facilityId: number;

  @IsNotEmpty()
  patientId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  appointmentDateTime: Date;

  @IsOptional()
  @IsNumber()
  previousAppointmentId?: number;
}

export class DocumentationDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  url: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  appointmentDateTime?: Date;

  @IsOptional()
  @IsNumber()
  previousAppointmentId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentationDto)
  documentation?: DocumentationDto[];

  @IsOptional()
  servicesReceived?: string[];
}
