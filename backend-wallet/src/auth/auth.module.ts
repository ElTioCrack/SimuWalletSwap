// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    WalletModule, // Asegúrate de importar WalletModule
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '24h' }, // Opciones de firma del token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
