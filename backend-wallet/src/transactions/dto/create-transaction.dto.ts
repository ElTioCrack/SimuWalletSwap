import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The public key of the origin wallet' })
  readonly publicKeyOrigin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The public key of the destination wallet' })
  readonly publicKeyDestination: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The token of the transaction' })
  readonly token: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The amount of the transaction' })
  readonly amount: number;
}
