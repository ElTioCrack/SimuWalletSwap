import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCryptoHoldingDto } from './create-crypto-holding.dto';

class UpdateCryptoHoldingDto extends PartialType(CreateCryptoHoldingDto) {
  @ApiProperty({ example: 'BTC' })
  token: string;

  @ApiProperty({ example: 1.5 })
  amount: number;
}

export { UpdateCryptoHoldingDto };
