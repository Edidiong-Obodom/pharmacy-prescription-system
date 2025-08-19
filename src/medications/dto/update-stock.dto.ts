import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsIn,
} from 'class-validator';

export class UpdateStockDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['add', 'subtract', 'set'])
  operation: 'add' | 'subtract' | 'set';
}
