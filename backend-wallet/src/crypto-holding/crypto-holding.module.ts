import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoHolding, CryptoHoldingSchema } from 'src/schemas/';
import { WalletModule } from 'src/wallet';
import {
  CryptoHoldingController,
  CryptoHoldingService,
  CryptoHoldingRepository,
} from 'src/crypto-holding';

@Module({
  imports: [
    WalletModule,
    MongooseModule.forFeature([
      { name: CryptoHolding.name, schema: CryptoHoldingSchema },
    ]),
  ],
  controllers: [CryptoHoldingController],
  providers: [CryptoHoldingService, CryptoHoldingRepository],
  exports: [CryptoHoldingService, CryptoHoldingRepository],
})
export class CryptoHoldingModule {}
