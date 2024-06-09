import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse as SwaggerApiResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Transaction created successfully.',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.transactionsService.createTransaction(
        createTransactionDto,
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create transaction',
        data: null,
      };
    }
  }

  @Get(':publicKey')
  @ApiOperation({ summary: 'Get all transactions for a wallet' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully.',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Wallet not found.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async findAll(
    @Param('publicKey') publicKey: string,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.transactionsService.findAll(publicKey);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve transactions',
        data: null,
      };
    }
  }

  @Get(':publicKey/:id')
  @ApiOperation({ summary: 'Get a specific transaction for a wallet' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully.',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Transaction not found.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async findOne(
    @Param('publicKey') publicKey: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.transactionsService.findOne(publicKey, id);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve transaction',
        data: null,
      };
    }
  }

  @Put(':publicKey/:id')
  @ApiOperation({ summary: 'Update a transaction for a wallet' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction updated successfully.',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Transaction not found.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async update(
    @Param('publicKey') publicKey: string,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.transactionsService.update(
        publicKey,
        id,
        updateTransactionDto,
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update transaction',
        data: null,
      };
    }
  }

  @Delete(':publicKey/:id')
  @ApiOperation({ summary: 'Delete a transaction for a wallet' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Transaction deleted successfully.',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Transaction not found.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async delete(
    @Param('publicKey') publicKey: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.transactionsService.delete(publicKey, id);
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
