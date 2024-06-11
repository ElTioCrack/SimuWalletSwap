import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AllTransaction, AllTransactionSchema } from 'src/schemas';
import { AllTransactionController } from './all-transaction.controller';
import { AllTransactionService } from './all-transaction.service';
import { AllTransactionRepository } from './all-transaction.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AllTransaction.name, schema: AllTransactionSchema}])
  ],
  controllers: [AllTransactionController],
  providers: [AllTransactionService, AllTransactionRepository],
  exports: [AllTransactionService, AllTransactionRepository],
})
export class AllTransactionModule {}
