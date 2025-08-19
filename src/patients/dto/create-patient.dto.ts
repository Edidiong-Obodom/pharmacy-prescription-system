import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  dateOfBirth: Date;
}
