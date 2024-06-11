import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse as SwaggerApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Wallet } from 'src/schemas';
import { WalletService } from 'src/wallet';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateWalletDto } from './dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
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
      const wallet = await this.walletService.create(walletData);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create wallet',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all wallets' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Wallets retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getAllWallets(): Promise<ApiResponse<any>> {
    try {
      const wallets = await this.walletService.findAll();
      return wallets;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallets',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Get('public')
  @SwaggerApiResponse({
    status: 200,
    description: 'Public wallets retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getAllPublicWallets(): Promise<ApiResponse<any>> {
    try {
      const wallets = await this.walletService.findAllPublic();
      return wallets;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallets',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a wallet by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Wallet retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Wallet not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getWalletById(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.findOneById(id);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallet',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Get('public-key/:publicKey')
  @ApiOperation({ summary: 'Get a wallet by public key' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Wallet retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Wallet not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findByPublicKey(
    @Param('publicKey') publicKey: string,
  ): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.findOneByPublicKey(publicKey);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallet by public key',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Get('mnemonic/:mnemonic')
  @ApiOperation({ summary: 'Get wallet by mnemonic' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Wallet retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Wallet not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findByMnemonic(
    @Param('mnemonic') mnemonic: string,
  ): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.findOneByMnemonic(mnemonic);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallet by mnemonic',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Wallet updated successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Wallet not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async updateWallet(
    @Param('id') id: string,
    @Body() updateData: Partial<Wallet>,
  ): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.update(id, updateData);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update wallet',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Wallet deleted successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Wallet not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deleteWallet(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.delete(id);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to delete wallet',
        data: 'controller: ' + error.message,
      };
    }
  }
}
