import { Injectable, HttpStatus } from '@nestjs/common';
import { Transaction } from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { WalletService } from 'src/wallet';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly walletService: WalletService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<any>> {
    const { address, type, token, amount } = createTransactionDto;

    try {
      const wallet = await this.walletService.findOneByPublicKey(address);
      if (!wallet.success) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Wallet not found',
          data: `Wallet with public key ${address} does not exist`,
        };
      }

      wallet.data.transactions.push({
        ...createTransactionDto,
        timestamp: createTransactionDto.timestamp
          ? createTransactionDto.timestamp
          : new Date().toISOString(),
      });

      const response = await this.walletService.update(
        wallet.data._id,
        wallet.data,
      );

      if (response.success) {
        return {
          statusCode: HttpStatus.OK,
          success: true,
          message: 'Transaction added successfully',
          data: response.data,
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to update wallet with new transaction',
          data: response.data,
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to complete transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  async findAll(publicKey: string): Promise<ApiResponse<any>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.success) {
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
      message: 'Transactions retrieved successfully',
      data: wallet.data.transactions,
    };
  }

  async findOne(publicKey: string, id: string): Promise<ApiResponse<any>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.success) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Wallet not found',
        data: null,
      };
    }

    const transaction = wallet.data.transactions.find(
      (tx) => tx._id.toString() === id,
    );
    if (!transaction) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Transaction not found',
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    };
  }

  async findByAllTransactionId(
    publicKey: string,
    allTransactionId: string,
  ): Promise<ApiResponse<any>> {
    try {
      // Buscar la wallet por la clave pública
      const wallet = await this.walletService.findOneByPublicKey(publicKey);
      if (!wallet.success) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: `Wallet with public key ${publicKey} not found`,
          data: null,
        };
      }
  
      // Buscar la transacción en la lista de transacciones de la wallet
      const transaction = wallet.data.transactions.find(
        (tx) => tx.allTransactionId === allTransactionId,
      );
  
      if (!transaction) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: `Transaction with allTransactionId ${allTransactionId} not found in wallet ${publicKey}`,
          data: null,
        };
      }
  
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }
  

  async update(
    publicKey: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponse<any>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.success) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Wallet not found',
        data: null,
      };
    }

    const transactionIndex = wallet.data.transactions.findIndex(
      (tx) => tx._id.toString() === id,
    );
    if (transactionIndex === -1) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Transaction not found',
        data: null,
      };
    }

    wallet.data.transactions[transactionIndex] = {
      ...wallet.data.transactions[transactionIndex],
      ...updateTransactionDto,
    };

    await this.walletService.update(wallet.data._id, wallet.data);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Transaction updated successfully',
      data: wallet.data.transactions[transactionIndex],
    };
  }

  async delete(publicKey: string, id: string): Promise<ApiResponse<any>> {
    const wallet = await this.walletService.findOneByPublicKey(publicKey);
    if (!wallet.success) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Wallet not found',
        data: null,
      };
    }

    const transactionIndex = wallet.data.transactions.findIndex(
      (tx) => tx._id.toString() === id,
    );
    if (transactionIndex === -1) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'Transaction not found',
        data: null,
      };
    }

    wallet.data.transactions.splice(transactionIndex, 1);
    await this.walletService.update(wallet.data._id, wallet.data);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Transaction deleted successfully',
      data: null,
    };
  }
}
