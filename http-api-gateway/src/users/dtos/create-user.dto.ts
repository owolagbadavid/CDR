import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CreatePatientDto extends CreateUserDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;
}

export class CreatePersonnelDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  facilityId?: number;
}
