import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'src/schemas';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The address involved in the transaction' })
  readonly address: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  @ApiProperty({
    description: 'The type of the transaction',
    enum: TransactionType,
  })
  readonly type: TransactionType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The token of the transaction' })
  readonly token: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The amount of the transaction' })
  readonly amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Timestamp of the transaction', required: false })
  readonly timestamp?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'ID of the related allTransaction', required: false })
  readonly allTransactionId?: string;
}
