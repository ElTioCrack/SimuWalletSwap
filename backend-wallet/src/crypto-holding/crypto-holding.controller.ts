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
} from '@nestjs/swagger';
import { CryptoHolding } from 'src/schemas';
import ApiResponse from 'src/interfaces/api-response.interface';
import { CreateCryptoHoldingDto, UpdateCryptoHoldingDto } from './dto';
import { CryptoHoldingService } from './crypto-holding.service';

@ApiTags('crypto-holding')
@Controller('crypto-holding')
export class CryptoHoldingController {
  constructor(private readonly cryptoHoldingService: CryptoHoldingService) {}

  @Post(':publicKey')
  @ApiOperation({ summary: 'Create a new CryptoHolding for a wallet' })
  @SwaggerApiResponse({
    status: 201,
    description: 'CryptoHolding created successfully.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Param('publicKey') publicKey: string,
    @Body() createCryptoHoldingDto: CreateCryptoHoldingDto,
  ): Promise<ApiResponse<CryptoHolding>> {
    try {
      return await this.cryptoHoldingService.create(
        publicKey,
        createCryptoHoldingDto,
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Failed to create CryptoHolding',
        data: null,
      };
    }
  }

  @Get(':publicKey')
  @ApiOperation({ summary: 'Retrieve all CryptoHoldings for a wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'CryptoHoldings retrieved successfully.',
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll(
    @Param('publicKey') publicKey: string,
  ): Promise<ApiResponse<CryptoHolding[]>> {
    try {
      return await this.cryptoHoldingService.findAll(publicKey);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve CryptoHoldings',
        data: null,
      };
    }
  }

  @Put(':publicKey/:token')
  @ApiOperation({ summary: 'Update a specific CryptoHolding for a wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'CryptoHolding updated successfully.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('publicKey') publicKey: string,
    @Param('token') token: string,
    @Body() updateCryptoHoldingDto: UpdateCryptoHoldingDto,
  ): Promise<ApiResponse<CryptoHolding>> {
    try {
      return await this.cryptoHoldingService.update(
        publicKey,
        token,
        updateCryptoHoldingDto,
      );
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Failed to update CryptoHolding',
        data: null,
      };
    }
  }

  @Delete(':publicKey/:token')
  @ApiOperation({ summary: 'Delete a specific CryptoHolding for a wallet' })
  @SwaggerApiResponse({
    status: 200,
    description: 'CryptoHolding deleted successfully.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request.' })
  async delete(
    @Param('publicKey') publicKey: string,
    @Param('token') token: string,
  ): Promise<ApiResponse<null>> {
    try {
      return await this.cryptoHoldingService.delete(publicKey, token);
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Failed to delete CryptoHolding',
        data: null,
      };
    }
  }
}
