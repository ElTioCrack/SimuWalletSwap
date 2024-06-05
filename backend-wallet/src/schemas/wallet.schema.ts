import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transaction, TransactionSchema } from './transaction.schema';
import { CryptoHolding, CryptoHoldingSchema } from './crypto-holding.schema';

@Schema({ collection: 'wallets', timestamps: true })
// @Schema({ timestamps: false })
export class Wallet extends Document {
  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  mnemonic: string;

  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [CryptoHoldingSchema], default: [] })
  cryptoHoldings?: CryptoHolding[];

  @Prop({ type: [TransactionSchema], default: [] })
  transactions?: Transaction[];
}


export const WalletSchema = SchemaFactory.createForClass(Wallet);

export default { Wallet, WalletSchema };
