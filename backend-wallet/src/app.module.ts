import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://jose:123456789%40JoSe@5.249.165.141:27017/admin'),
    TaskModule,
    WalletModule,
    AuthModule],
})
export class AppModule {}
