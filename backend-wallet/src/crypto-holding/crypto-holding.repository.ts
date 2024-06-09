import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptoHolding } from 'src/schemas';
import { CreateCryptoHoldingDto, UpdateCryptoHoldingDto } from './dto';
import ApiResponse from '../interfaces/api-response.interface';

@Injectable()
export class CryptoHoldingRepository {
  constructor(
    @InjectModel(CryptoHolding.name)
    private readonly cryptoHoldingModel: Model<CryptoHolding>,
  ) {}

  async create(
    createCryptoHoldingDto: CreateCryptoHoldingDto,
  ): Promise<ApiResponse<CryptoHolding>> {
    try {
      const createdCryptoHolding = new this.cryptoHoldingModel(
        createCryptoHoldingDto,
      );
      const savedCryptoHolding = await createdCryptoHolding.save();
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'CryptoHolding created successfully',
        data: savedCryptoHolding,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create CryptoHolding',
        data: null,
      };
    }
  }

  async findAll(): Promise<ApiResponse<CryptoHolding[]>> {
    try {
      const cryptoHoldings = await this.cryptoHoldingModel.find().exec();
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'CryptoHoldings retrieved successfully',
        data: cryptoHoldings,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve CryptoHoldings',
        data: null,
      };
    }
  }

  async findOne(id: string): Promise<ApiResponse<CryptoHolding>> {
    try {
      const cryptoHolding = await this.cryptoHoldingModel.findById(id).exec();
      if (!cryptoHolding) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'CryptoHolding not found',
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'CryptoHolding retrieved successfully',
        data: cryptoHolding,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve CryptoHolding',
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateCryptoHoldingDto: UpdateCryptoHoldingDto,
  ): Promise<ApiResponse<CryptoHolding>> {
    try {
      const updatedCryptoHolding = await this.cryptoHoldingModel
        .findByIdAndUpdate(id, updateCryptoHoldingDto, { new: true })
        .exec();
      if (!updatedCryptoHolding) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'CryptoHolding not found',
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'CryptoHolding updated successfully',
        data: updatedCryptoHolding,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update CryptoHolding',
        data: null,
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const deletedCryptoHolding = await this.cryptoHoldingModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedCryptoHolding) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'CryptoHolding not found',
          data: null,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'CryptoHolding deleted successfully',
        data: null,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to delete CryptoHolding',
        data: null,
      };
    }
  }
}
