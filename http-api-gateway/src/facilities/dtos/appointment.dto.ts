import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  MISSED = 'missed',
}

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
  @Type(() => Number)
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

export class AppointmentFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  facilityId?: number;

  @IsOptional()
  @IsString()
  patientId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
