// src/crypto/crypto.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './../schemas/wallet.schema';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class CryptoModule {}
