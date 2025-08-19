import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication)
    private readonly medicationModel: typeof Medication,
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    const medicationData: any = {
      name: createMedicationDto.name,
      stockQuantity: createMedicationDto.stockQuantity,
      unitPrice: createMedicationDto.unitPrice,
    };

    if (createMedicationDto.description) {
      medicationData.description = createMedicationDto.description;
    }

    return this.medicationModel.create(medicationData);
  }

  async findAll(): Promise<Medication[]> {
    return this.medicationModel.findAll();
  }

  async findOne(id: string): Promise<Medication> {
    const medication = await this.medicationModel.findByPk(id);
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }

  async updateStock(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Medication> {
    const medication = await this.findOne(id);

    if (updateStockDto.operation === 'add') {
      medication.stockQuantity += updateStockDto.quantity;
    } else if (updateStockDto.operation === 'subtract') {
      if (medication.stockQuantity < updateStockDto.quantity) {
        throw new BadRequestException('Insufficient stock quantity');
      }
      medication.stockQuantity -= updateStockDto.quantity;
    } else {
      medication.stockQuantity = updateStockDto.quantity;
    }

    await medication.save();
    return medication;
  }

  async getLowStockMedications(threshold: number = 10): Promise<Medication[]> {
    return this.medicationModel.findAll({
      where: {
        stockQuantity: {
          [Op.lt]: threshold,
        },
      },
    });
  }

  async checkStock(id: string, requiredQuantity: number): Promise<boolean> {
    const medication = await this.findOne(id);
    return medication.stockQuantity >= requiredQuantity;
  }
}
