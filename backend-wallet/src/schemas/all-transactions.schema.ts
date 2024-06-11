import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

@Schema()
export class AllTransaction extends Document {
  @ApiProperty({ description: 'ID of the transaction' })
  _id: string;

  @ApiProperty({ description: 'The wallet of the miner', required: false })
  @Prop({ required: false })
  minerWallet?: string;

  @ApiProperty({ description: 'Timestamp of the transaction' })
  @Prop({ required: true })
  timestamp: Date;

  @ApiProperty({ description: 'Status of the transaction' })
  @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @ApiProperty({ description: 'Sender wallet' })
  @Prop({ required: true })
  from: string;

  @ApiProperty({ description: 'Receiver wallet' })
  @Prop({ required: true })
  to: string;

  @ApiProperty({ description: 'Amount of the transaction' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ description: 'Token of the transaction' })
  @Prop({ required: true })
  token: string;
}

export const AllTransactionSchema = SchemaFactory.createForClass(AllTransaction);
