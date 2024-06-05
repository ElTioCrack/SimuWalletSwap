import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://adminUser:StrongP%40ssw0rd!@localhost:27017/'),
    WalletModule,
    CryptoModule,
    AuthModule],
    controllers: [AppController],
})
export class AppModule {}
