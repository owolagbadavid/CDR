import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class QualificationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end: Date;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  issuer: string;
}

export class CreateFacilityDto {
  // name of the facility

  @IsNotEmpty()
  name: string;

  // address of the facility

  @IsNotEmpty()
  address: string;

  // phone number of the facility

  @IsNotEmpty()
  phone: string;

  // email of the facility

  @IsNotEmpty()
  @IsEmail()
  email: string;

  // website of the facility

  @IsNotEmpty()
  website: string;

  // facility description

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Type(() => QualificationDto)
  @ValidateNested()
  qualification?: QualificationDto;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  alias?: string[];

  @IsOptional()
  partOfId?: number;

  @IsOptional()
  type?: string;
}
