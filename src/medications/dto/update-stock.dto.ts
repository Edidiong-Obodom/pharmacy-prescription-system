import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['add', 'subtract', 'set'])
  operation: 'add' | 'subtract' | 'set';
}
