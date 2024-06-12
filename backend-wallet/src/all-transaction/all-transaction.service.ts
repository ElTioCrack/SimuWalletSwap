import { Injectable, HttpStatus } from '@nestjs/common';
import {
  AllTransaction,
  TransactionStatus,
  TransactionType,
} from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { TransactionsService } from 'src/transactions';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  UpdateMinerWalletDto,
} from './dto';

import { AllTransactionRepository } from './all-transaction.repository';
import { WalletService } from 'src/wallet';

@Injectable()
export class AllTransactionService {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionsService: TransactionsService,
    private readonly allTransactionRepository: AllTransactionRepository,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<any>> {
    try {
      const transaction = await this.allTransactionRepository.create({
        ...createTransactionDto,
        timestamp: createTransactionDto.timestamp
          ? createTransactionDto.timestamp
          : new Date().toISOString(),
      });

      if (!transaction.success) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to create transaction in AllTransaction',
          data: `AllTransaction creation error: ${transaction.data}`,
        };
      }

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Transaction created in AllTransaction successfully',
        data: transaction.data,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create transaction in AllTransaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  async createTransactionProcess(
    createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<any>> {
    const timestamp = new Date().toISOString();
    let allTransactionId: string;
    let originWalletTransaction: { publicKey: string; id: string } = {
      publicKey: '',
      id: '',
    };
    let destinationWalletTransaction: { publicKey: string; id: string } = {
      publicKey: '',
      id: '',
    };

    try {
      // Create the transaction in AllTransaction collection
      const transaction = await this.allTransactionRepository.create({
        ...createTransactionDto,
        timestamp: timestamp,
      });

      if (!transaction.success) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to create transaction in AllTransaction',
          data: `AllTransaction creation error: ${transaction.data}`,
        };
      }

      allTransactionId = transaction.data.id;

      // Create pending transaction in the origin wallet
      const walletOrigin = await this.transactionsService.createTransaction({
        ...createTransactionDto,
        address: createTransactionDto.to,
        type: TransactionType.PENDING,
        timestamp: timestamp,
        allTransactionId: allTransactionId,
      });

      if (!walletOrigin.success) {
        throw new Error(
          `Origin wallet transaction creation error: ${walletOrigin.data}`,
        );
      }

      originWalletTransaction.id = walletOrigin.data.id;
      originWalletTransaction.publicKey = createTransactionDto.from;

      // Create pending transaction in the destination wallet
      const walletDestination =
        await this.transactionsService.createTransaction({
          ...createTransactionDto,
          address: createTransactionDto.from,
          type: TransactionType.PENDING,
          timestamp: timestamp,
          allTransactionId: allTransactionId,
        });

      if (!walletDestination.success) {
        throw new Error(
          `Destination wallet transaction creation error: ${walletDestination.data}`,
        );
      }

      destinationWalletTransaction.id = walletDestination.data.id;
      destinationWalletTransaction.publicKey = createTransactionDto.to;

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Transaction created successfully',
        data: {
          allTransactionId,
          originWalletTransaction,
          destinationWalletTransaction,
        },
      };
    } catch (error) {
      // Rollback logic
      if (originWalletTransaction.id) {
        await this.transactionsService.delete(
          originWalletTransaction.publicKey,
          originWalletTransaction.id,
        );
      }

      if (destinationWalletTransaction.id) {
        await this.transactionsService.delete(
          destinationWalletTransaction.publicKey,
          destinationWalletTransaction.id,
        );
      }

      if (allTransactionId) {
        await this.allTransactionRepository.delete(allTransactionId);
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to complete transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  async findAll(): Promise<ApiResponse<any>> {
    return this.allTransactionRepository.findAll();
  }

  async findAllPendingTransactions(): Promise<ApiResponse<any>> {
    try {
      const transactions = await this.allTransactionRepository.findAll();

      if (!transactions.success) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to retrieve transactions',
          data: `Error: ${transactions.data}`,
        };
      }

      const pendingTransactions = transactions.data
        .filter(
          (transaction) => transaction.status === TransactionStatus.PENDING,
        )
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Pending transactions retrieved successfully',
        data: pendingTransactions,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve pending transactions',
        data: `Exception: ${error.message}`,
      };
    }
  }

  async find(id: string): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionRepository.find(id);
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionRepository.update(id, updateTransactionDto);
  }

  async updateMinerWallet(
    id: string,
    updateMinerWalletDto: UpdateMinerWalletDto,
  ): Promise<ApiResponse<AllTransaction>> {
    const update = {
      minerWallet: updateMinerWalletDto.minerWallet,
      status: 'complete',
    };
    return this.allTransactionRepository.update(id, update);
  }

  async updatePendingTransaction(
    id: string,
    updateMinerWalletDto: UpdateMinerWalletDto,
  ): Promise<ApiResponse<any>> {
    let rollbackData: {
      originWalletId?: string;
      destinationWalletId?: string;
      minerWalletId?: string;
      originTransactionId?: string;
      destinationTransactionId?: string;
      minerTransactionId?: string;
      allTransactionId?: string;
      commissionAmount?: number;
      amount?: number;
      token?: string;
    } = {};

    try {
      // Step 1: Find the transaction in AllTransaction collection
      const transaction = await this.allTransactionRepository.find(id);

      if (!transaction.success) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Transaction not found',
          data: `Transaction with id ${id} does not exist`,
        };
      }

      // Ensure the transaction is in pending state
      if (transaction.data.status !== TransactionStatus.PENDING) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Transaction is not in pending state',
          data: `Transaction with id ${id} is not pending`,
        };
      }

      rollbackData.commissionAmount = transaction.data.commission;
      rollbackData.amount = transaction.data.amount;
      rollbackData.token = transaction.data.token;

      // Step 2: Find and update the origin wallet transaction
      const idWalletOrigin = await this.transactionsService.findByAllTransactionId(
        transaction.data.from,
        id,
      );
      if (!idWalletOrigin.success) {
        throw new Error(
          `Origin wallet ${transaction.data.from} transaction not found for id ${transaction.data._id}`,
        );
      }

      const walletOrigin = await this.walletService.findOneByPublicKey(
        transaction.data.from,
      );
      if (!walletOrigin.success) {
        throw new Error(
          `Origin wallet not found for public key ${transaction.data.from}`,
        );
      }

      const originHolding = walletOrigin.data.cryptoHoldings.find(
        (holding) => holding.token === transaction.data.token,
      );

      if (!originHolding) {
        throw new Error(
          `No holding found for token ${transaction.data.token} in the origin wallet ${transaction.data.from}`,
        );
      }

      if (
        originHolding.amount <=
        transaction.data.amount + transaction.data.commission
      ) {
        throw new Error(
          `Insufficient funds in the origin wallet ${transaction.data.from}. Available: ${originHolding.amount}, Required: ${transaction.data.amount + transaction.data.commission}`,
        );
      }

      originHolding.amount -=
        transaction.data.amount + transaction.data.commission;

      const transactionSend = walletOrigin.data.transactions.find(
        (transaction) => transaction.allTransactionId === id,
      );

      if (!transactionSend) {
        throw new Error(
          `No SEND transaction found in the origin wallet for allTransactionId ${id}`,
        );
      }

      transactionSend.type = TransactionType.SEND;

      const updatedOriginWallet = await this.walletService.update(
        walletOrigin.data._id,
        walletOrigin.data,
      );
      if (!updatedOriginWallet.success) {
        throw new Error(`Failed to update origin wallet holdings`);
      }

      rollbackData.originWalletId = walletOrigin.data._id;

      // Step 3: Find and update the destination wallet transaction
      const idWalletDestination = await this.transactionsService.findByAllTransactionId(
        transaction.data.to,
        id,
      );
      if (!idWalletDestination.success) {
        throw new Error(
          `Destination wallet transaction not found for id ${transaction.data._id}`,
        );
      }

      const walletDestination = await this.walletService.findOneByPublicKey(
        transaction.data.to,
      );
      if (!walletDestination.success) {
        throw new Error(
          `Destination wallet not found for public key ${transaction.data.to}`,
        );
      }

      let destinationHolding = walletDestination.data.cryptoHoldings.find(
        (holding) => holding.token === transaction.data.token,
      );
      if (!destinationHolding) {
        walletDestination.data.cryptoHoldings.push({
          token: transaction.data.token,
          amount: transaction.data.amount,
        });
      } else {
        destinationHolding.amount += transaction.data.amount;
      }

      const transactionReceive = walletDestination.data.transactions.find(
        (transaction) => transaction.allTransactionId === id,
      );

      if (!transactionReceive) {
        throw new Error(
          `No RECEIVE transaction found in the destination wallet for allTransactionId ${id}`,
        );
      }

      transactionReceive.type = TransactionType.RECEIVE;

      const updatedDestinationWallet = await this.walletService.update(
        walletDestination.data._id,
        walletDestination.data,
      );
      if (!updatedDestinationWallet.success) {
        throw new Error(`Failed to update destination wallet holdings`);
      }

      rollbackData.destinationWalletId = walletDestination.data._id;

      // Step 4: Update holdings and add transaction to the miner's wallet
      const minerWallet = await this.walletService.findOneByPublicKey(
        updateMinerWalletDto.minerWallet,
      );
      if (!minerWallet.success) {
        throw new Error(
          `Miner wallet not found for public key ${updateMinerWalletDto.minerWallet}`,
        );
      }

      let minerHolding = minerWallet.data.cryptoHoldings.find(
        (holding) => holding.token === transaction.data.token,
      );
      if (!minerHolding) {
        minerWallet.data.cryptoHoldings.push({
          token: transaction.data.token,
          amount: transaction.data.commission,
        });
      } else {
        minerHolding.amount += transaction.data.commission;
      }

      const minerTransaction = {
        type: TransactionType.RECEIVE,
        token: transaction.data.token,
        amount: transaction.data.commission,
        address: transaction.data.from,
        timestamp: new Date().toISOString(),
        allTransactionId: id,
      };

      minerWallet.data.transactions.push(minerTransaction);

      const updatedMinerWallet = await this.walletService.update(
        minerWallet.data._id,
        minerWallet.data,
      );
      if (!updatedMinerWallet.success) {
        throw new Error(`Failed to update miner wallet holdings`);
      }

      rollbackData.minerWalletId = minerWallet.data._id;

      // Step 5: Update the transaction in AllTransaction collection
      const updatedTransaction = await this.allTransactionRepository.update(id, {
        minerWallet: updateMinerWalletDto.minerWallet,
        status: TransactionStatus.COMPLETE,
      });

      if (!updatedTransaction.success) {
        throw new Error(`Failed to update transaction with id ${id}`);
      }

      rollbackData.allTransactionId = id;

      // Fetch the updated transaction from the database to verify changes
      const updatedTransactionData = await this.allTransactionRepository.find(id);
      if (!updatedTransactionData.success) {
        throw new Error(`Failed to retrieve updated transaction with id ${id}`);
      }

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Transaction updated successfully',
        data: {
          updatedTransaction: updatedTransactionData.data,
          walletOrigin: updatedOriginWallet.data,
          walletDestination: updatedDestinationWallet.data,
          minerTransaction: minerTransaction,
        },
      };
    } catch (error) {
      // Rollback logic
      try {
        if (rollbackData.originWalletId && rollbackData.token) {
          const walletOrigin = await this.walletService.findOneById(
            rollbackData.originWalletId,
          );
          if (walletOrigin.success) {
            const originHolding = walletOrigin.data.cryptoHoldings.find(
              (holding) => holding.token === rollbackData.token,
            );
            if (originHolding) {
              originHolding.amount +=
                rollbackData.commissionAmount + rollbackData.amount;
              await this.walletService.update(
                walletOrigin.data._id,
                walletOrigin.data,
              );
            }
          }
        }

        if (rollbackData.destinationWalletId && rollbackData.token) {
          const walletDestination = await this.walletService.findOneById(
            rollbackData.destinationWalletId,
          );
          if (walletDestination.success) {
            let destinationHolding = walletDestination.data.cryptoHoldings.find(
              (holding) => holding.token === rollbackData.token,
            );
            if (destinationHolding) {
              destinationHolding.amount -= rollbackData.amount;
              if (destinationHolding.amount === 0) {
                walletDestination.data.cryptoHoldings =
                  walletDestination.data.cryptoHoldings.filter(
                    (holding) => holding.token !== rollbackData.token,
                  );
              }
              await this.walletService.update(
                walletDestination.data._id,
                walletDestination.data,
              );
            }
          }
        }

        if (rollbackData.minerWalletId && rollbackData.commissionAmount) {
          const minerWallet = await this.walletService.findOneById(
            rollbackData.minerWalletId,
          );
          if (minerWallet.success) {
            let minerHolding = minerWallet.data.cryptoHoldings.find(
              (holding) => holding.token === rollbackData.token,
            );
            if (minerHolding) {
              minerHolding.amount -= rollbackData.commissionAmount;
              await this.walletService.update(
                minerWallet.data._id,
                minerWallet.data,
              );
            }
          }
        }

        if (rollbackData.originTransactionId) {
          await this.transactionsService.delete(
            rollbackData.originTransactionId,
            rollbackData.originWalletId,
          );
        }

        if (rollbackData.destinationTransactionId) {
          await this.transactionsService.delete(
            rollbackData.destinationTransactionId,
            rollbackData.destinationWalletId,
          );
        }

        if (rollbackData.minerTransactionId) {
          await this.transactionsService.delete(
            rollbackData.minerTransactionId,
            rollbackData.minerWalletId,
          );
        }

        if (rollbackData.allTransactionId) {
          await this.allTransactionRepository.delete(
            rollbackData.allTransactionId,
          );
        }
      } catch (rollbackError) {
        console.error(`Rollback failed: ${rollbackError.message}`);
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update pending transaction',
        data: `Exception: ${error.message} rollbackData: ${JSON.stringify(
          rollbackData,
        )}`,
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    return this.allTransactionRepository.delete(id);
  }
}
