import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('doctor/login')
  async loginDoctor(@Body() loginDto: LoginDto) {
    return this.authService.loginDoctor(loginDto);
  }

  @Post('patient/login')
  async loginPatient(@Body() loginDto: LoginDto) {
    return this.authService.loginPatient(loginDto);
  }

  // Legacy endpoint for backward compatibility
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
