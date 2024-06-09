import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWalletDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The mnemonic of the wallet' })
  readonly mnemonic: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The password of the wallet' })
  readonly password: string;
}
