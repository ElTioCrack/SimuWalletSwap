import { Injectable, HttpStatus } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './../schemas/wallet.schema';
import { CreateWalletDto } from './dto/wallet.dto';
import ApiResponse from './../interfaces/api-response.interface';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async create(walletData: CreateWalletDto): Promise<ApiResponse<any>> {
    try {
      const existingWallet = await this.walletRepository.findOneByPublicKey(
        walletData.publicKey,
      );
      if (existingWallet.success) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'A wallet with the same public key already exists',
          data: null,
        };
      }

      const createdWallet = await this.walletRepository.create({
        mnemonic: walletData.mnemonic,
        publicKey: walletData.publicKey,
        password: walletData.password,
      });

      return createdWallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create wallet',
        data: error.message,
      };
    }
  }

  async findAll(): Promise<ApiResponse<any>> {
    try {
      const wallets = await this.walletRepository.findAll();
      return wallets;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallets',
        data: 'service: ' + error.message,
      };
    }
  }

  async findOneById(id: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletRepository.findOneById(id);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallet',
        data: 'service: ' + error.message,
      };
    }
  }

  async findOneByPublicKey(publicKey: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletRepository.findOneByPublicKey(publicKey);
      return wallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallet',
        data: 'service: ' + error.message,
      };
    }
  }

  async update(
    id: string,
    updateData: Partial<Wallet>,
  ): Promise<ApiResponse<any>> {
    try {
      const updatedWallet = await this.walletRepository.update(id, updateData);
      return updatedWallet;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update wallet',
        data: 'service: ' + error.message,
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<any>> {
    try {
      const deletedWallet = await this.walletRepository.delete(id);
      return deletedWallet
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to delete wallet',
        data: 'service: ' + error.message,
      };
    }
  }
}
