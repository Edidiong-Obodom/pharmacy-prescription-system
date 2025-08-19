import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Medication } from '../../medications/entities/medication.entity';

export enum PrescriptionStatus {
  PENDING = 'pending',
  FILLED = 'filled',
  PICKED_UP = 'picked_up',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'prescriptions',
  timestamps: true,
})
export class Prescription extends Model<Prescription> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare patientId: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare doctorId: string;

  @ForeignKey(() => Medication)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare medicationId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare dosage: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare instructions: string;

  @Column({
    type: DataType.ENUM(...Object.values(PrescriptionStatus)),
    allowNull: false,
    defaultValue: PrescriptionStatus.PENDING,
  })
  declare status: PrescriptionStatus;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  declare totalPrice: number;

  @BelongsTo(() => Patient)
  declare patient: Patient;

  @BelongsTo(() => Doctor)
  declare doctor: Doctor;

  @BelongsTo(() => Medication)
  declare medication: Medication;
}
