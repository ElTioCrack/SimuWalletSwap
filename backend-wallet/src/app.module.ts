import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    TaskModule,
    WalletModule,
    CryptoModule,
    AuthModule],
})
export class AppModule {}
