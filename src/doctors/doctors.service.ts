import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor)
    private readonly doctorModel: typeof Doctor,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const existingDoctor = await this.findByEmail(createDoctorDto.email);
    if (existingDoctor) {
      throw new ConflictException('Doctor with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);

    const doctorData: any = {
      name: createDoctorDto.name,
      email: createDoctorDto.email,
      password: hashedPassword,
      specialization: createDoctorDto.specialization,
    };

    if (createDoctorDto.phone) {
      doctorData.phone = createDoctorDto.phone;
    }

    const doctor = await this.doctorModel.create(doctorData);

    // Remove password from response
    const { password, ...result } = doctor.toJSON();
    return result as Doctor;
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ where: { email } });
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }
}
