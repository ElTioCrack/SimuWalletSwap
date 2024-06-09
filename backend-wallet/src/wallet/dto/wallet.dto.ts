// create-wallet.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The mnemonic phrase of the wallet' })
  readonly mnemonic: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The password of the wallet' })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The public key of the wallet' })
  readonly publicKey: string;
}
