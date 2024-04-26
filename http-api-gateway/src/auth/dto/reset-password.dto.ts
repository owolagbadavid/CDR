import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
