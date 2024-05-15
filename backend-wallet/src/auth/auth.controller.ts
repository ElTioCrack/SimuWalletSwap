import { Controller, Headers, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import ApiResponse from './../interfaces/api-response.interface';
import { CreateWalletDto } from 'src/wallet/dto/wallet.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-wallet')
  async createWallet(
    @Body() walletData: CreateWalletDto,
  ): Promise<ApiResponse<any>> {
    try {
      if (!walletData) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Missing wallet data',
          data: null,
        };
      }

      const createdWallet = await this.authService.register(walletData);

      if (!createdWallet.success) {
        return {
          statusCode: createdWallet.statusCode,
          success: createdWallet.success,
          message: createdWallet.message,
          data: createdWallet.data,
        };
      }

      return createdWallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create wallet',
        data: null,
      };
    }
  }

  @Post('access-wallet')
  async accessWallet(@Body() credentials: any): Promise<ApiResponse<any>> {
    try {
      const tokens = await this.authService.login(credentials);
      if (!tokens) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Invalid credentials',
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Credentials are correct',
        data: tokens,
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

  @Post('verify-access-token')
  async verifyAccessToken(
    @Headers('Authorization') token: string,
  ): Promise<ApiResponse<any>> {
    try {
      const isValid = await this.authService.verifyAccessToken(token);
      return {
        statusCode: isValid.statusCode,
        success: isValid.success,
        message: isValid.message,
        data: isValid.data,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to verify access token',
        data: null,
      };
    }
  }

  @Post('verify-refresh-token')
  async verifyRefreshToken(
    @Headers('Authorization') token: string,
  ): Promise<ApiResponse<any>> {
    try {
      const isValid = await this.authService.verifyRefreshToken(token);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Refresh token verified',
        data: isValid,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to verify refresh token',
        data: null,
      };
    }
  }

  @Post('generate-access-token')
  async generateAccessTokenFromRefreshToken(
    @Headers('Authorization') refreshToken: string,
  ): Promise<ApiResponse<any>> {
    try {
      const accessToken =
        await this.authService.generateAccessTokenFromRefreshToken(
          refreshToken,
        );
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
        data: accessToken,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to generate access token from refresh token',
        data: null,
      };
    }
  }
}
