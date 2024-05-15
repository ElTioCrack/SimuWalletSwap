import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class CryptoHolding {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  amount: number;
}

const CryptoHoldingSchema = SchemaFactory.createForClass(CryptoHolding);

export { CryptoHolding, CryptoHoldingSchema };
