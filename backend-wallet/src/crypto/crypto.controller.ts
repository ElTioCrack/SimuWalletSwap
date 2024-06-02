// src/crypto/crypto.controller.ts
import { Controller, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import ApiResponse from './../interfaces/api-response.interface';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post(':id/holding')
  async addCryptoHolding(
    @Param('id') id: string,
    @Body('token') token: string,
    @Body('amount') amount: number,
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.cryptoService.addCryptoHolding(id, token, amount);
      return response;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to add crypto holding',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Post(':id/transaction')
  async addTransaction(
    @Param('id') id: string,
    @Body('type') type: string,
    @Body('token') token: string,
    @Body('amount') amount: number,
    @Body('address') address: string,
    @Body('timestamp') timestamp: string,
  ): Promise<ApiResponse<any>> {
    try {
      const transaction = { type, token, amount, address, timestamp };
      const response = await this.cryptoService.addTransaction(id, transaction);
      return response;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to add transaction',
        data: 'controller: ' + error.message,
      };
    }
  }
}
