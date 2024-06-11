import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMinerWalletDto {
  @IsString()
  @ApiProperty({ description: 'Miner wallet' })
  minerWallet: string;
}