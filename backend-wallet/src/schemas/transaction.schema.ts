import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum TransactionType {
  SEND = 'send',
  RECEIVE = 'receive',
  PENDING = 'pending',
  FAILED = 'failed',
}

@Schema()
class Transaction {
  @Prop({ enum: Object.values(TransactionType), required: true })
  type: TransactionType;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: false })
  allTransactionId?: string;
}

const TransactionSchema = SchemaFactory.createForClass(Transaction);

export { Transaction, TransactionType, TransactionSchema };
