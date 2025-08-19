import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreatePrescriptionDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  instructions?: string;
}
