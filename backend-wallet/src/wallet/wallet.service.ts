import { Injectable, HttpStatus } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './../schemas/wallet.schema';
import ApiResponse from './../interfaces/api-response.interface';
import { CreateWalletDto } from './dto/wallet.dto';

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
          data: 'service',
        };
      }

      const createdWallet = await this.walletRepository.create({
        mnemonic: walletData.mnemonic,
        publicKey: walletData.publicKey,
        password: walletData.password,
      });

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Wallet created successfully',
        data: createdWallet.data,
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create wallet',
        data: 'service: ' + error.message,
      };
    }
  }

  async findAll(): Promise<ApiResponse<any>> {
    try {
      const wallets = await this.walletRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Wallets retrieved successfully',
        data: wallets.data,
      };
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
      if (!wallet || !wallet.data) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found for ID: ' + id,
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Wallet retrieved successfully',
        data: wallet.data,
      };
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
      if (!wallet || !wallet.data) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found for public key: ' + publicKey,
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Wallet retrieved successfully',
        data: wallet.data,
      };
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
      if (!updatedWallet || !updatedWallet.data) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found for ID: ' + id,
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Wallet updated successfully',
        data: updatedWallet.data,
      };
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
      if (!deletedWallet || !deletedWallet.data) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found for ID: ' + id,
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Wallet deleted successfully',
        data: deletedWallet.data,
      };
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
