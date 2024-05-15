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

import { WalletService } from './wallet.service';
import { Wallet } from './../schemas/wallet.schema';
import HttpsStatus from './../enums/http-status.enum';

import ApiResponse from './../interfaces/api-response.interface';
import { CreateWalletDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(@Body() walletData: CreateWalletDto): Promise<ApiResponse<any>> {
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

  @Get(':id')
  async getWalletById(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.findOneById(id);
      if (!wallet) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found',
          data: null,
        };
      }
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
  async findByPublicKey(
    @Param('publicKey') publicKey: string,
  ): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.findOneByPublicKey(publicKey);
      if (!wallet) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found',
          data: null,
        };
      }
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

  @Put(':id')
  async updateWallet(
    @Param('id') id: string,
    @Body() updateData: Partial<Wallet>,
  ): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.update(id, updateData);
      if (!wallet) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found',
          data: null,
        };
      }
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
  async deleteWallet(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.delete(id);
      if (!wallet) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found',
          data: null,
        };
      }
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
