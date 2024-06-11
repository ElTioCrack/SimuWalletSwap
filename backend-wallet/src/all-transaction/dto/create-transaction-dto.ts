import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/schemas';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Timestamp of the transaction' })
  readonly timestamp: Date;

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
}
