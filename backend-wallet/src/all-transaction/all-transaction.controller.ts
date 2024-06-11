import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { AllTransaction } from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateTransactionDto, UpdateTransactionDto, UpdateMinerWalletDto } from './dto';
import { AllTransactionService } from './all-transaction.service';

@ApiTags('all-transactions')
@Controller('all-transactions')
export class AllTransactionController {
  constructor(private readonly allTransactionService: AllTransactionService) {}

  @Post()
  @SwaggerApiResponse({
    status: 201,
    description: 'Transaction created successfully.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionService.createTransaction(createTransactionDto);
  }

  @Get()
  @SwaggerApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllTransactions(): Promise<ApiResponse<AllTransaction[]>> {
    return this.allTransactionService.findAllTransactions();
  }

  @Get(':id')
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findTransactionById(
    @Param('id') id: string,
  ): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionService.findTransactionById(id);
  }

  @Put(':id')
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction updated successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionService.updateTransaction(id, updateTransactionDto);
  }

  @Put(':id/miner-wallet')
  @SwaggerApiResponse({
    status: 200,
    description: 'Miner wallet updated successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async updateMinerWallet(
    @Param('id') id: string,
    @Body() updateMinerWalletDto: UpdateMinerWalletDto,
  ): Promise<ApiResponse<AllTransaction>> {
    return this.allTransactionService.updateMinerWallet(id, updateMinerWalletDto);
  }

  @Delete(':id')
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction deleted successfully.',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deleteTransaction(@Param('id') id: string): Promise<ApiResponse<null>> {
    return this.allTransactionService.deleteTransaction(id);
  }
}
