// src/crypto/crypto.service.ts
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './../schemas/wallet.schema';
import ApiResponse from './../interfaces/api-response.interface';

@Injectable()
export class CryptoService {
  constructor(@InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>) {}

  async addCryptoHolding(walletId: string, token: string, amount: number): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletModel.findByIdAndUpdate(
        walletId,
        { $push: { cryptoHoldings: { token, amount } } },
        { new: true, useFindAndModify: false }
      ).exec();
      if (!wallet) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found',
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Crypto holding added successfully',
        data: wallet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to add crypto holding',
        data: 'service: ' + error.message,
      };
    }
  }

  async addTransaction(walletId: string, transaction: any): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletModel.findByIdAndUpdate(
        walletId,
        { $push: { transactions: transaction } },
        { new: true, useFindAndModify: false }
      ).exec();
      if (!wallet) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found',
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Transaction added successfully',
        data: wallet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to add transaction',
        data: 'service: ' + error.message,
      };
    }
  }
}
