import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ description: 'name of the doctor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'email of the doctor' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password of the doctor' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'specialization of the doctor' })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({ description: 'phone number of the doctor' })
  @IsString()
  @IsOptional()
  phone?: string;
}
