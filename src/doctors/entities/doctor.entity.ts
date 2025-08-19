import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Prescription } from '../../prescriptions/entities/prescription.entity';

@Table({
  tableName: 'doctors',
  timestamps: true,
})
export class Doctor extends Model<Doctor> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare specialization: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone: string;

  @HasMany(() => Prescription)
  declare prescriptions: Prescription[];
}
