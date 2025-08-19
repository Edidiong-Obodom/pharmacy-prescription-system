import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrescriptionStatus } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionStatusDto } from './dto/update-prescription-status.dto';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto, @Request() req) {
    return this.prescriptionsService.create(createPrescriptionDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('patientId') patientId?: string,
    @Query('status') status?: PrescriptionStatus,
  ) {
    return this.prescriptionsService.findAll(patientId, status);
  }

  @Get('my-prescriptions')
  findMyPrescriptions(@Request() req) {
    return this.prescriptionsService.findByDoctor(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdatePrescriptionStatusDto,
  ) {
    return this.prescriptionsService.updateStatus(id, updateStatusDto);
  }
}
