import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient)
    private patientModel: typeof Patient,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const existingPatient = await this.findByEmail(createPatientDto.email);
    if (existingPatient) {
      throw new ConflictException('Patient with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createPatientDto.password, 10);

    const patientData: any = {
      name: createPatientDto.name,
      email: createPatientDto.email,
      password: hashedPassword,
      phone: createPatientDto.phone,
      dateOfBirth: createPatientDto.dateOfBirth,
    };

    const patient = await this.patientModel.create(patientData);

    // Remove password from response
    const { password, ...result } = patient.toJSON();
    return result as Patient;
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.patientModel.findOne({ where: { email } });
  }

  async search(query: string): Promise<Patient[]> {
    return this.patientModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: { exclude: ['password'] },
    });
  }
}
