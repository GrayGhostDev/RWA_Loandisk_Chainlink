import { ethers } from 'ethers';
import { TransactionValidator } from './validator';
import { FeeCalculator } from './fee';
import { EventLogger, AuditEventType } from '../audit/eventLogger';
import { TransactionType } from '@/types/transaction';

export class TransactionProcessor {
  private validator: typeof TransactionValidator;
  private feeCalculator: typeof FeeCalculator;
  private eventLogger: EventLogger;

  constructor() {
    this.validator = TransactionValidator;
    this.feeCalculator = FeeCalculator;
    this.eventLogger = EventLogger.getInstance();
  }

  async processTransaction(
    userId: string,
    amount: ethers.BigNumber,
    type: TransactionType,
    userStatus: string
  ) {
    try {
      // Validate transaction
      this.validator.validateUserStatus(userStatus);
      this.validator.validateAmount(amount);
      this.validator.validateTransactionType(type);
      await this.validator.validateDailyLimit(userId, amount, type);

      // Calculate fees
      const userTotalVolume = await this.getUserTotalVolume(userId);
      const fee = this.feeCalculator.calculateFee(amount, type, userTotalVolume);
      const netAmount = this.feeCalculator.getNetAmount(amount, fee);

      // Log transaction event
      await this.eventLogger.logTransactionEvent(
        userId,
        'transaction-id', // In real app, this would be generated
        'created',
        {
          type,
          amount: amount.toString(),
          fee: fee.toString(),
          netAmount: netAmount.toString()
        }
      );

      return {
        amount,
        fee,
        netAmount,
        timestamp: Date.now()
      };
    } catch (error) {
      await this.eventLogger.logTransactionEvent(
        userId,
        'transaction-id',
        'failed',
        { error: error.message }
      );
      throw error;
    }
  }

  private async getUserTotalVolume(userId: string): Promise<ethers.BigNumber> {
    // In a real application, fetch this from database
    return ethers.utils.parseUnits('0', 6);
  }
}