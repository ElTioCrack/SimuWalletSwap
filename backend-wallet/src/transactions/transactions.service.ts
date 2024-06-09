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
    const { publicKeyOrigin, publicKeyDestination, token, amount } =
      createTransactionDto;

    try {
      const originWallet = await this.walletService.findOneByPublicKey(publicKeyOrigin);

      if (!originWallet.success) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Origin wallet not found',
          data: `Origin wallet with publicKey ${publicKeyOrigin} does not exist`,
        };
      }

      const originHolding = originWallet.data.cryptoHoldings.find(
        (holding) => holding.token === token,
      );

      if (!originHolding || originHolding.amount < amount) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Insufficient funds',
          data: 'The origin wallet does not have enough funds',
        };
      }

      // Step 1: Deduct amount from origin wallet
      originHolding.amount -= amount;
      const updatedOriginWallet = await this.walletService.update(originWallet.data._id, originWallet.data);

      if (!updatedOriginWallet.success) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to update origin wallet',
          data: 'Failed to deduct amount from origin wallet',
        };
      }

      // Step 2: Insert send transaction in origin wallet
      const transactionTimestamp = new Date().toISOString();
      const sendTransaction =
        await this.transactionsRepository.createTransaction(
          {
            type: 'send',
            token,
            amount,
            address: publicKeyDestination,
            timestamp: transactionTimestamp,
          },
        );

      if (!sendTransaction.success) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to create send transaction in origin wallet',
          data: `Send Transaction Error: ${sendTransaction.data}`,
        };
      }

      // Step 3: Add amount to destination wallet
      let destinationWallet = await this.walletService.findOneByPublicKey(
        publicKeyDestination,
      );

      if (!destinationWallet.success) {
        destinationWallet = await this.walletService.create({
          mnemonic: 'random mnemonic',
          publicKey: publicKeyDestination,
          password: 'random password',
        });
      }

      let destinationHolding = destinationWallet.data.cryptoHoldings.find(
        (holding) => holding.token === token,
      );

      if (!destinationHolding) {
        destinationWallet.data.cryptoHoldings.push({
          token: token,
          amount: amount,
        });
      } else {
        destinationHolding.amount += amount;
      }

      const updatedDestinationWallet = await this.walletService.update(destinationWallet.data._id, destinationWallet.data);

      if (!updatedDestinationWallet.success) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to update destination wallet',
          data: 'Failed to add amount to destination wallet',
        };
      }

      // Step 4: Insert receive transaction in destination wallet
      const receiveTransaction =
        await this.transactionsRepository.createTransaction(
          {
            type: 'receive',
            address: publicKeyOrigin,
            token,
            amount,
            timestamp: transactionTimestamp,
          },
        );

      if (!receiveTransaction.success) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to create receive transaction in destination wallet',
          data: `Receive Transaction Error: ${receiveTransaction.data}`,
        };
      }

      // Step 5: Insert send transaction reference in origin wallet's transaction array
      originWallet.data.transactions.push(sendTransaction.data);
      await this.walletService.update(originWallet.data._id, originWallet.data);

      // Step 6: Insert receive transaction reference in destination wallet's transaction array
      destinationWallet.data.transactions.push(receiveTransaction.data);
      await this.walletService.update(destinationWallet.data._id, destinationWallet.data);

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Transaction completed successfully',
        data: {
          sendTransaction: sendTransaction.data,
          receiveTransaction: receiveTransaction.data,
        },
      };
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
