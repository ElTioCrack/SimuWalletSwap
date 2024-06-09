// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WalletModule } from 'src/wallet/wallet.module';
import { AuthController, AuthService } from 'src/auth';

@Module({
  imports: [
    WalletModule,
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
