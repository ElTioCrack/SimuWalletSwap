import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AllTransaction } from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';

@Injectable()
export class AllTransactionRepository {
  constructor(
    @InjectModel(AllTransaction.name)
    private readonly transactionModel: Model<AllTransaction>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<AllTransaction>> {
    try {
      const createdTransaction = new this.transactionModel(
        createTransactionDto,
      );
      const savedTransaction = await createdTransaction.save();
      return {
        statusCode: 201,
        success: true,
        message: 'Transaction created successfully',
        data: savedTransaction,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Failed to create transaction',
        data: error.message,
      };
    }
  }

  async findAllTransactions(): Promise<ApiResponse<AllTransaction[]>> {
    try {
      const transactions = await this.transactionModel.find().exec();
      return {
        statusCode: 200,
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Failed to retrieve transactions',
        data: error.message,
      };
    }
  }

  async findTransactionById(id: string): Promise<ApiResponse<AllTransaction>> {
    try {
      const transaction = await this.transactionModel.findById(id).exec();
      if (!transaction) {
        return {
          statusCode: 404,
          success: false,
          message: 'Transaction not found',
          data: null,
        };
      }
      return {
        statusCode: 200,
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Failed to retrieve transaction',
        data: error.message,
      };
    }
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: Partial<UpdateTransactionDto>,
  ): Promise<ApiResponse<AllTransaction>> {
    try {
      const updatedTransaction = await this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, { new: true }).exec();
      if (!updatedTransaction) {
        return {
          statusCode: 404,
          success: false,
          message: 'Transaction not found',
          data: null,
        };
      }
      return {
        statusCode: 200,
        success: true,
        message: 'Transaction updated successfully',
        data: updatedTransaction,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Failed to update transaction',
        data: error.message,
      };
    }
  }

  async deleteTransaction(id: string): Promise<ApiResponse<null>> {
    try {
      const deletedTransaction = await this.transactionModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedTransaction) {
        return {
          statusCode: 404,
          success: false,
          message: 'Transaction not found',
          data: null,
        };
      }
      return {
        statusCode: 200,
        success: true,
        message: 'Transaction deleted successfully',
        data: null,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Failed to delete transaction',
        data: error.message,
      };
    }
  }
}
