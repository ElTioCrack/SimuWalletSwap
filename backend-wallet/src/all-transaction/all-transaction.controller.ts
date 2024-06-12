import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse as SwaggerApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AllTransactionService } from './all-transaction.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  UpdateMinerWalletDto,
} from './dto';
import ApiResponse from 'src/interfaces/api-response.interface';
import { AllTransaction } from 'src/schemas';

@ApiTags('all-transactions')
@Controller('all-transactions')
export class AllTransactionController {
  constructor(private readonly allTransactionService: AllTransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.allTransactionService.create(createTransactionDto);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Post('process')
  @ApiOperation({ summary: 'Process a new transaction' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Transaction processed successfully',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async createTransactionProcess(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.allTransactionService.createTransactionProcess(
        createTransactionDto,
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to process transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll(): Promise<ApiResponse<any>> {
    try {
      return await this.allTransactionService.findAll();
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve transactions',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Get('pending')
  @SwaggerApiResponse({
    status: 200,
    description: 'Pending transactions retrieved successfully.',
    type: [AllTransaction],
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllPendingTransactions(): Promise<ApiResponse<any>> {
    try {
      const response =
        await this.allTransactionService.findAllPendingTransactions();
      return response;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve pending transactions',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async find(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      return await this.allTransactionService.find(id);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.allTransactionService.update(id, updateTransactionDto);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Put(':id/miner')
  @ApiOperation({ summary: 'Update a transaction with miner wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateMinerWallet(
    @Param('id') id: string,
    @Body() updateMinerWalletDto: UpdateMinerWalletDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.allTransactionService.updateMinerWallet(
        id,
        updateMinerWalletDto,
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update miner wallet',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Put('update-pending/:id')
  @ApiOperation({
    summary:
      'Update a pending transaction with miner wallet and mark it as complete',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request' })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async updatePendingTransaction(
    @Param('id') id: string,
    @Body() updateMinerWalletDto: UpdateMinerWalletDto,
  ): Promise<ApiResponse<any>> {
    try {
      const result = await this.allTransactionService.updatePendingTransaction(
        id,
        updateMinerWalletDto,
      );

      if (result.success) {
        return {
          statusCode: HttpStatus.OK,
          success: true,
          message: 'Transaction updated successfully',
          data: result.data,
        };
      } else {
        return {
          statusCode: result.statusCode,
          success: false,
          message: result.message,
          data: result.data,
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update pending transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction deleted successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'Transaction not found' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error' })
  async delete(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      return await this.allTransactionService.delete(id);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to delete transaction',
        data: `Exception: ${error.message}`,
      };
    }
  }
}
