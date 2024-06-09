import { ApiProperty } from '@nestjs/swagger';

export class CreateCryptoHoldingDto {
  @ApiProperty({ example: 'BTC' })
  token: string;

  @ApiProperty({ example: 1.5 })
  amount: number;
}
