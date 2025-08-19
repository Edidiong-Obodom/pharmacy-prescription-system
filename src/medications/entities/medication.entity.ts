import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Prescription } from '../../prescriptions/entities/prescription.entity';

@Table({
  tableName: 'medications',
  timestamps: true,
})
export class Medication extends Model<Medication> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare stockQuantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare unitPrice: number;

  @HasMany(() => Prescription)
  declare prescriptions: Prescription[];
}
