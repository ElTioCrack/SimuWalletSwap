import {
  Controller,
  Headers,
  Post,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse as SwaggerApiResponse, ApiOperation } from '@nestjs/swagger';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateWalletDto } from 'src/wallet/dto/wallet.dto';
import { LoginWalletDto } from './dto'
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-wallet')
  @ApiOperation({ summary: 'Create a new wallet' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Wallet created successfully.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
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
  @ApiOperation({ summary: 'Access a wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Wallet accessed successfully.',
  })
  @SwaggerApiResponse({ status: 401, description: 'Invalid credentials.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async accessWallet(@Body() credentials: LoginWalletDto): Promise<ApiResponse<any>> {
    try {
      const tokens = await this.authService.loginWithMnemonic(credentials);
      if (!tokens.success) {
        return tokens;
      }
      return tokens;
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
  @ApiOperation({ summary: 'Verify access token' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Access token verified successfully.',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async verifyAccessToken(
    @Headers('Authorization') token: string,
  ): Promise<ApiResponse<any>> {
    try {
      const isValid = await this.authService.verifyAccessToken(token);
      return isValid;
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
  @ApiOperation({ summary: 'Verify refresh token' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Refresh token verified successfully.',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async verifyRefreshToken(
    @Headers('Authorization') token: string,
  ): Promise<ApiResponse<any>> {
    try {
      const isValid = await this.authService.verifyRefreshToken(token);
      return isValid;
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
  @ApiOperation({ summary: 'Generate access token from refresh token' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Access token generated successfully.',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async generateAccessTokenFromRefreshToken(
    @Headers('Authorization') refreshToken: string,
  ): Promise<ApiResponse<any>> {
    try {
      const accessToken =
        await this.authService.generateAccessTokenFromRefreshToken(
          refreshToken,
        );
      return accessToken;
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
