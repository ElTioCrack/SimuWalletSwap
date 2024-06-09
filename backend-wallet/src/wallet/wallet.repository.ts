import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './../schemas/wallet.schema';
import { CreateWalletDto } from './dto/wallet.dto';
import ApiResponse from './../interfaces/api-response.interface';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
  ) {}

  async startTransaction() {
    const session = await this.walletModel.db.startSession();
    session.startTransaction();
    return session;
  }

  async create(walletData: CreateWalletDto): Promise<ApiResponse<any>> {
    try {
      const createdWallet = new this.walletModel({
        mnemonic: walletData.mnemonic,
        publicKey: walletData.publicKey,
        password: walletData.password,
        createdAt: new Date().toISOString(),
        cryptoHoldings: [{ token: 'SOL', amount: 0 }],
        transactions: [],
      });

      const savedWallet = await createdWallet.save();
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Wallet created successfully',
        data: savedWallet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create wallet',
        data: 'repository: ' + error.message,
      };
    }
  }

  async findAll(): Promise<ApiResponse<any>> {
    try {
      const wallets = await this.walletModel.find().exec();
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Wallets retrieved successfully',
        data: wallets,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallets',
        data: 'repository: ' + error.message,
      };
    }
  }

  async findOneById(id: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletModel.findById(id).exec();
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
        message: 'Wallet retrieved successfully',
        data: wallet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallet',
        data: 'repository: ' + error.message,
      };
    }
  }

  async findOneByPublicKey(publicKey: string): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletModel.findOne({ publicKey }).exec();
      if (!wallet) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found for the given public key',
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Wallet retrieved successfully',
        data: wallet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve wallet',
        data: 'repository: ' + error.message,
      };
    }
  }

  async findOneByMnemonic(mnemonic: string): Promise<Wallet | null> {
    return this.walletModel.findOne({ mnemonic }).exec();
  }

  async update(
    id: string,
    updateData: Partial<Wallet>,
  ): Promise<ApiResponse<any>> {
    try {
      const updatedWallet = await this.walletModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      if (!updatedWallet) {
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
        message: 'Wallet updated successfully',
        data: updatedWallet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update wallet',
        data: 'repository: ' + error.message,
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<any>> {
    try {
      const deletedWallet = await this.walletModel.findByIdAndDelete(id).exec();
      if (!deletedWallet) {
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
        message: 'Wallet deleted successfully',
        data: deletedWallet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to delete wallet',
        data: 'repository: ' + error.message,
      };
    }
  }
}
