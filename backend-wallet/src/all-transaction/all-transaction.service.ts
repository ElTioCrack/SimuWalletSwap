import { Injectable, HttpStatus } from '@nestjs/common';
import { AllTransaction } from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateTransactionDto, UpdateTransactionDto, UpdateMinerWalletDto } from './dto';

import { AllTransactionRepository } from './all-transaction.repository';

@Injectable()
export class AllTransactionService {
  constructor(
    private readonly allTransactionRepository: AllTransactionRepository,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<ApiResponse<AllTransaction>> {
    const transaction = {
      ...createTransactionDto,
      minerWallet: '',
      status: 'pending',
    };
    return this.allTransactionRepository.createTransaction(transaction);
  }

  async findAllTransactions(): Promise<ApiResponse<AllTransaction[]>> {
    return this.allTransactionRepository.findAllTransactions();
  }

  async findTransactionById(id: string): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionRepository.findTransactionById(id);
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionRepository.updateTransaction(id, updateTransactionDto);
  }

  async updateMinerWallet(
    id: string,
    updateMinerWalletDto: UpdateMinerWalletDto,
  ): Promise<ApiResponse<AllTransaction>> {
    const update = {
      minerWallet: updateMinerWalletDto.minerWallet,
      status: 'complete',
    };
    return this.allTransactionRepository.updateTransaction(id, update);
  }

  async deleteTransaction(id: string): Promise<ApiResponse<null>> {
    return this.allTransactionRepository.deleteTransaction(id);
  }
}
