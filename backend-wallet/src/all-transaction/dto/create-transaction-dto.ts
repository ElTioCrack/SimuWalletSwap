import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Sender wallet' })
  readonly from: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Receiver wallet' })
  readonly to: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Amount of the transaction' })
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Token of the transaction' })
  readonly token: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Commission of the transaction' })
  readonly commission: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'Timestamp of the transaction', required: false })
  readonly timestamp?: string;
}
