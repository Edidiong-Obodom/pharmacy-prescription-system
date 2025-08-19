import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private doctorsService: DoctorsService,
    private patientsService: PatientsService,
    private jwtService: JwtService,
  ) {}

  async validateDoctor(email: string, password: string): Promise<any> {
    const doctor = await this.doctorsService.findByEmail(email);
    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      const { password, ...result } = doctor.toJSON();
      return result;
    }
    return null;
  }

  async validatePatient(email: string, password: string): Promise<any> {
    const patient = await this.patientsService.findByEmail(email);
    if (patient && (await bcrypt.compare(password, patient.password))) {
      const { password, ...result } = patient.toJSON();
      return result;
    }
    return null;
  }

  async loginDoctor(loginDto: LoginDto) {
    const doctor = await this.validateDoctor(loginDto.email, loginDto.password);
    if (!doctor) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: doctor.email,
      sub: doctor.id,
      role: 'doctor',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        role: 'doctor',
        specialization: doctor.specialization,
      },
    };
  }

  async loginPatient(loginDto: LoginDto) {
    const patient = await this.validatePatient(
      loginDto.email,
      loginDto.password,
    );
    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: patient.email,
      sub: patient.id,
      role: 'patient',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        role: 'patient',
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
      },
    };
  }

  // Legacy method for backward compatibility
  async login(loginDto: LoginDto) {
    return this.loginDoctor(loginDto);
  }
}
