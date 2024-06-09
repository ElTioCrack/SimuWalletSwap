import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { CryptoHoldingModule } from './crypto-holding/crypto-holding.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CryptoModule } from './crypto/crypto.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://adminUser:StrongP%40ssw0rd!@localhost:27017/',
    ),
    AuthModule,
    WalletModule,
    CryptoHoldingModule,
    TransactionsModule,
    CryptoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
