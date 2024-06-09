import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from 'src/schemas';
import { WalletModule } from 'src/wallet';
import {
  TransactionsController,
  TransactionsService,
  TransactionsRepository,
} from 'src/transactions';

@Module({
  imports: [
    WalletModule,
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}