import { IsNotEmpty, IsEnum } from 'class-validator';
import { PrescriptionStatus } from '../entities/prescription.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePrescriptionStatusDto {
  @ApiProperty()
  @IsEnum(PrescriptionStatus)
  @IsNotEmpty()
  status: PrescriptionStatus;
}
