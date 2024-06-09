import { Injectable, HttpStatus } from '@nestjs/common';
import { CryptoHolding } from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { WalletService } from 'src/wallet';
import { CreateCryptoHoldingDto, UpdateCryptoHoldingDto } from './dto';
import { CryptoHoldingRepository } from './crypto-holding.repository';

@Injectable()
export class CryptoHoldingService {
  constructor(
    private readonly walletService: WalletService,
  ) {}

  async create(
    publicKey: string,
    createCryptoHoldingDto: CreateCryptoHoldingDto,
  ): Promise<ApiResponse<CryptoHolding>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.data) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Wallet not found',
        data: null,
      };
    }

    const existingHolding = wallet.data.cryptoHoldings.find(
      (holding) => holding.token === createCryptoHoldingDto.token,
    );
    if (existingHolding) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'CryptoHolding already exists in the wallet',
        data: null,
      };
    }

    wallet.data.cryptoHoldings.push(createCryptoHoldingDto);
    await this.walletService.update(wallet.data._id, wallet.data);

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'CryptoHolding added to wallet successfully',
      data: createCryptoHoldingDto,
    };
  }

  async findAll(publicKey: string): Promise<ApiResponse<CryptoHolding[]>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.data) {
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
      message: 'CryptoHoldings retrieved successfully',
      data: wallet.data.cryptoHoldings,
    };
  }

  async update(
    publicKey: string,
    token: string,
    updateCryptoHoldingDto: UpdateCryptoHoldingDto,
  ): Promise<ApiResponse<CryptoHolding>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.data) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Wallet not found',
        data: null,
      };
    }

    const holdingIndex = wallet.data.cryptoHoldings.findIndex(
      (holding) => holding.token === token,
    );
    if (holdingIndex === -1) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'CryptoHolding not found in the wallet',
        data: null,
      };
    }

    wallet.data.cryptoHoldings[holdingIndex] = {
      ...wallet.data.cryptoHoldings[holdingIndex],
      ...updateCryptoHoldingDto,
    };

    await this.walletService.update(wallet.data._id, wallet.data);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'CryptoHolding updated successfully',
      data: wallet.data.cryptoHoldings[holdingIndex],
    };
  }

  async delete(publicKey: string, token: string): Promise<ApiResponse<null>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.data) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Wallet not found',
        data: null,
      };
    }

    const holdingIndex = wallet.data.cryptoHoldings.findIndex(
      (holding) => holding.token === token,
    );
    if (holdingIndex === -1) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'CryptoHolding not found in the wallet',
        data: null,
      };
    }

    wallet.data.cryptoHoldings.splice(holdingIndex, 1);
    await this.walletService.update(wallet.data._id, wallet.data);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'CryptoHolding deleted successfully',
      data: null,
    };
  }
}
