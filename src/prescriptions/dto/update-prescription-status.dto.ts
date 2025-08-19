import { IsNotEmpty, IsEnum } from 'class-validator';
import { PrescriptionStatus } from '../entities/prescription.entity';

export class UpdatePrescriptionStatusDto {
  @IsEnum(PrescriptionStatus)
  @IsNotEmpty()
  status: PrescriptionStatus;
}
