import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Prescription } from './entities/prescription.entity';
import { MedicationsModule } from '../medications/medications.module';
import { PatientsModule } from '../patients/patients.module';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Prescription]),
    MedicationsModule,
    PatientsModule,
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
