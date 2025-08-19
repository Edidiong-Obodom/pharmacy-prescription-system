import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  instructions?: string;
}
