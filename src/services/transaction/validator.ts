import { ethers } from 'ethers';
import { ValidationError } from '@/utils/errors';
import { TransactionType } from '@/types/transaction';

export class TransactionValidator {
  private static readonly MIN_AMOUNT = ethers.utils.parseUnits('0.01', 6);
  private static readonly MAX_AMOUNT = ethers.utils.parseUnits('100000', 6);
  private static readonly DAILY_LIMIT = ethers.utils.parseUnits('500000', 6);

  static validateAmount(amount: ethers.BigNumber): void {
    if (amount.lt(this.MIN_AMOUNT)) {
      throw new ValidationError('Amount below minimum threshold');
    }
    if (amount.gt(this.MAX_AMOUNT)) {
      throw new ValidationError('Amount exceeds maximum threshold');
    }
  }

  static async validateDailyLimit(
    userId: string,
    amount: ethers.BigNumber,
    type: TransactionType
  ): Promise<void> {
    // In a real application, fetch user's daily transaction total from database
    const dailyTotal = ethers.utils.parseUnits('0', 6); // Mock value
    
    if (dailyTotal.add(amount).gt(this.DAILY_LIMIT)) {
      throw new ValidationError('Daily transaction limit exceeded');
    }
  }

  static validateUserStatus(userStatus: string): void {
    if (userStatus !== 'active') {
      throw new ValidationError('User account is not active');
    }
  }

  static validateTransactionType(type: TransactionType): void {
    const validTypes = ['DEPOSIT', 'WITHDRAWAL', 'CONVERSION'];
    if (!validTypes.includes(type)) {
      throw new ValidationError('Invalid transaction type');
    }
  }
}