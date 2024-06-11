import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Miner wallet', required: false })
  minerWallet?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Status of the transaction', required: false })
  status?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Sender wallet', required: false })
  from?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Receiver wallet', required: false })
  to?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Amount of the transaction', required: false })
  amount?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Token of the transaction', required: false })
  token?: string;
}


