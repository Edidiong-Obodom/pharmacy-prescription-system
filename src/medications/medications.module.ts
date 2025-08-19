import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Medication } from './entities/medication.entity';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

@Module({
  imports: [SequelizeModule.forFeature([Medication])],
  controllers: [MedicationsController],
  providers: [MedicationsService],
  exports: [MedicationsService],
})
export class MedicationsModule {}
