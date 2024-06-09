import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async createTransaction(createTransactionDto: Transaction): Promise<ApiResponse<any>> {
    try {
      const createdTransaction = new this.transactionModel(createTransactionDto);
      const savedTransaction = await createdTransaction.save();
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Transaction created successfully',
        data: savedTransaction,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  async findAll(publicKey: string): Promise<ApiResponse<Transaction[]>> {
    try {
      const transactions = await this.transactionModel
        .find({ publicKey })
        .exec();
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve transactions',
        data: null,
      };
    }
  }

  async findOne(
    publicKey: string,
    timestamp: string,
  ): Promise<ApiResponse<Transaction>> {
    try {
      const transaction = await this.transactionModel
        .findOne({ publicKey, timestamp })
        .exec();
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
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve transaction',
        data: null,
      };
    }
  }

  async update(
    publicKey: string,
    timestamp: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponse<Transaction>> {
    try {
      const updatedTransaction = await this.transactionModel
        .findOneAndUpdate({ publicKey, timestamp }, updateTransactionDto, {
          new: true,
        })
        .exec();
      if (!updatedTransaction) {
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
        message: 'Transaction updated successfully',
        data: updatedTransaction,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update transaction',
        data: null,
      };
    }
  }

  async delete(
    publicKey: string,
    timestamp: string,
  ): Promise<ApiResponse<null>> {
    try {
      const deletedTransaction = await this.transactionModel
        .findOneAndDelete({ publicKey, timestamp })
        .exec();
      if (!deletedTransaction) {
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
        message: 'Transaction deleted successfully',
        data: null,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to delete transaction',
        data: null,
      };
    }
  }
}
