import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Prescription,
  PrescriptionStatus,
} from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionStatusDto } from './dto/update-prescription-status.dto';
import { MedicationsService } from '../medications/medications.service';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/entities/patient.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Medication } from '../medications/entities/medication.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription)
    private prescriptionModel: typeof Prescription,
    private medicationsService: MedicationsService,
    private patientsService: PatientsService,
  ) {}

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    doctorId: string,
  ): Promise<Prescription> {
    // Verify patient exists
    await this.patientsService.findOne(createPrescriptionDto.patientId);

    // Verify medication exists and check stock
    const medication = await this.medicationsService.findOne(
      createPrescriptionDto.medicationId,
    );

    if (
      !(await this.medicationsService.checkStock(
        createPrescriptionDto.medicationId,
        createPrescriptionDto.quantity,
      ))
    ) {
      throw new BadRequestException('Insufficient medication stock');
    }

    // Calculate total price
    const totalPrice =
      Number(medication.unitPrice) * createPrescriptionDto.quantity;

    const prescriptionData: any = {
      patientId: createPrescriptionDto.patientId,
      medicationId: createPrescriptionDto.medicationId,
      dosage: createPrescriptionDto.dosage,
      quantity: createPrescriptionDto.quantity,
      doctorId,
      totalPrice,
    };

    if (createPrescriptionDto.instructions) {
      prescriptionData.instructions = createPrescriptionDto.instructions;
    }

    const prescription = await this.prescriptionModel.create(prescriptionData);

    return this.findOne(prescription.id);
  }

  async findAll(
    patientId?: string,
    status?: PrescriptionStatus,
  ): Promise<Prescription[]> {
    const where: any = {};

    if (patientId) {
      where.patientId = patientId;
    }

    if (status) {
      where.status = status;
    }

    return this.prescriptionModel.findAll({
      where,
      include: [
        { model: Patient, attributes: ['id', 'name', 'email'] },
        { model: Doctor, attributes: ['id', 'name', 'specialization'] },
        { model: Medication, attributes: ['id', 'name', 'unitPrice'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionModel.findByPk(id, {
      include: [
        { model: Patient, attributes: ['id', 'name', 'email'] },
        { model: Doctor, attributes: ['id', 'name', 'specialization'] },
        { model: Medication, attributes: ['id', 'name', 'unitPrice'] },
      ],
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return prescription;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdatePrescriptionStatusDto,
  ): Promise<Prescription> {
    const prescription = await this.findOne(id);

    // Validate status transition
    if (prescription.status === PrescriptionStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot update status of cancelled prescription',
      );
    }

    if (
      prescription.status === PrescriptionStatus.PICKED_UP &&
      updateStatusDto.status !== PrescriptionStatus.PICKED_UP
    ) {
      throw new BadRequestException(
        'Cannot change status of picked up prescription',
      );
    }

    // If filling the prescription, reduce medication stock
    if (
      updateStatusDto.status === PrescriptionStatus.FILLED &&
      prescription.status === PrescriptionStatus.PENDING
    ) {
      await this.medicationsService.updateStock(prescription.medicationId, {
        quantity: prescription.quantity,
        operation: 'subtract',
      });
    }

    prescription.status = updateStatusDto.status;
    await prescription.save();

    return this.findOne(prescription.id);
  }

  async findByDoctor(doctorId: string): Promise<Prescription[]> {
    return this.prescriptionModel.findAll({
      where: { doctorId },
      include: [
        { model: Patient, attributes: ['id', 'name', 'email'] },
        { model: Medication, attributes: ['id', 'name', 'unitPrice'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
