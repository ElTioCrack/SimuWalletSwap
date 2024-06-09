import { Controller, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse as SwaggerApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import ApiResponse from './../interfaces/api-response.interface';

@ApiTags('crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post(':id/holding')
  @ApiOperation({ summary: 'Add a new crypto holding to a wallet' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Crypto holding added successfully.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ schema: { 
      type: 'object', 
      properties: { 
        token: { type: 'string' }, 
        amount: { type: 'number' }
      } 
    } 
  })
  async addCryptoHolding(
    @Param('id') id: string,
    @Body('token') token: string,
    @Body('amount') amount: number,
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.cryptoService.addCryptoHolding(id, token, amount);
      return response;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to add crypto holding',
        data: 'controller: ' + error.message,
      };
    }
  }

  @Post(':id/transaction')
  @ApiOperation({ summary: 'Add a new transaction to a wallet' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Transaction added successfully.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request.' })
  @SwaggerApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ schema: { 
      type: 'object', 
      properties: { 
        type: { type: 'string' }, 
        token: { type: 'string' }, 
        amount: { type: 'number' },
        address: { type: 'string' },
        timestamp: { type: 'string' }
      } 
    } 
  })
  async addTransaction(
    @Param('id') id: string,
    @Body('type') type: string,
    @Body('token') token: string,
    @Body('amount') amount: number,
    @Body('address') address: string,
    @Body('timestamp') timestamp: string,
  ): Promise<ApiResponse<any>> {
    try {
      const transaction = { type, token, amount, address, timestamp };
      const response = await this.cryptoService.addTransaction(id, transaction);
      return response;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to add transaction',
        data: 'controller: ' + error.message,
      };
    }
  }
}
