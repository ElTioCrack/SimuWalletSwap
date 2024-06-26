import { Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import ApiResponse from './../interfaces/api-response.interface';
import { WalletService } from './../wallet/wallet.service';
import { CreateWalletDto } from 'src/wallet/dto/wallet.dto';
import JwtUtils from '../utils/jwt.utils';
import { LoginWalletDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly walletService: WalletService) {}

  async register(walletData: CreateWalletDto): Promise<ApiResponse<any>> {
    try {
      const createdWallet = await this.walletService.create({
        mnemonic: walletData.mnemonic,
        publicKey: walletData.publicKey,
        password: walletData.password,
      });

      if (createdWallet.success) {
        const accessToken = JwtUtils.generateAccessToken(
          createdWallet.data._id,
        );
        const refreshToken = JwtUtils.generateRefreshToken(
          createdWallet.data._id,
        );

        return {
          statusCode: HttpStatus.CREATED,
          success: true,
          message: 'Wallet created successfully',
          data: { accessToken, refreshToken },
        };
      } else {
        return createdWallet;
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create wallet',
        data: error.message,
      };
    }
  }

  // async login(walletData: any): Promise<ApiResponse<any>> {
  //   try {
  //     const wallet = await this.walletService.findOneByPublicKey(
  //       walletData.publicKey,
  //     );
  //     if (!wallet.success) {
  //       return {
  //         statusCode: HttpStatus.UNAUTHORIZED,
  //         success: false,
  //         message: 'Invalid credentials',
  //         data: null,
  //       };
  //     }

  //     // Verificar la contraseña
  //     const isPasswordValid = await bcrypt.compare(
  //       walletData.password,
  //       wallet.data.password,
  //     );
  //     if (!isPasswordValid) {
  //       return {
  //         statusCode: HttpStatus.UNAUTHORIZED,
  //         success: false,
  //         message: 'Invalid credentials',
  //         data: null,
  //       };
  //     }

  //     // Generar tokens de acceso y de actualización
  //     const accessToken = JwtUtils.generateAccessToken(wallet.data._id);
  //     const refreshToken = JwtUtils.generateRefreshToken(wallet.data._id);

  //     return {
  //       statusCode: HttpStatus.OK,
  //       success: true,
  //       message: 'Credentials are correct',
  //       data: { accessToken, refreshToken },
  //     };
  //   } catch (error) {
  //     return {
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       success: false,
  //       message: 'Failed to access wallet',
  //       data: null,
  //     };
  //   }
  // }

  async loginWithMnemonic(
    walletData: LoginWalletDto,
  ): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.findOneByMnemonic(
        walletData.mnemonic,
      );
      if (!wallet.success) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Invalid credentials',
          data: null,
        };
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(
        walletData.password,
        wallet.data.password,
      );
      // const isPasswordValid = walletData.password == wallet.data.password

      if (!isPasswordValid) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Invalid credentials2',
          data: null,
        };
      }

      // Generar tokens de acceso y de actualización
      const accessToken = JwtUtils.generateAccessToken(wallet.data._id);
      const refreshToken = JwtUtils.generateRefreshToken(wallet.data._id);

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Credentials are correct',
        data: { accessToken, refreshToken },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to access wallet',
        data: null,
      };
    }
  }

  async verifyAccessToken(token: string): Promise<ApiResponse<boolean>> {
    try {
      const isValid = await JwtUtils.verifyAccessToken(token);
      const message = isValid
        ? 'Access token verified'
        : 'Access token verification failed';
      const statusCode = isValid ? HttpStatus.OK : HttpStatus.UNAUTHORIZED;

      return {
        statusCode,
        success: !!isValid,
        message,
        data: isValid,
      };
    } catch (error) {
      console.error('Error verifying access token:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to verify access token',
        data: null,
      };
    }
  }

  async verifyRefreshToken(token: string): Promise<ApiResponse<boolean>> {
    try {
      const isValid = await JwtUtils.verifyRefreshToken(token);
      const message = isValid
        ? 'Refresh token verified'
        : 'Refresh token verification failed';
      const statusCode = isValid ? HttpStatus.OK : HttpStatus.UNAUTHORIZED;

      return {
        statusCode,
        success: !!isValid,
        message,
        data: isValid,
      };
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to verify refresh token',
        data: null,
      };
    }
  }

  async generateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<ApiResponse<any>> {
    try {
      const accessToken =
        await JwtUtils.generateAccessTokenFromRefreshToken(refreshToken);
      const message = accessToken
        ? 'Access token generated from refresh token'
        : 'Failed to generate access token from refresh token';
      const statusCode = accessToken
        ? HttpStatus.OK
        : HttpStatus.INTERNAL_SERVER_ERROR;

      return {
        statusCode,
        success: !!accessToken,
        message,
        data: { accessToken }, // Simplificado a { accessToken }
      };
    } catch (error) {
      console.error('Error generating access token from refresh token:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to generate access token from refresh token',
        data: null,
      };
    }
  }
}
