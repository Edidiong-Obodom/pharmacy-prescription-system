import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Prescription } from '../../prescriptions/entities/prescription.entity';

@Table({
  tableName: 'patients',
  timestamps: true,
})
export class Patient extends Model<Patient> {
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
  declare phone: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare dateOfBirth: Date;

  @HasMany(() => Prescription)
  declare prescriptions: Prescription[];
}
