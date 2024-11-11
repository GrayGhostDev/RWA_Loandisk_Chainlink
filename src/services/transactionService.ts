import { ethers } from 'ethers';
import { TransactionProcessor } from './transaction/processor.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import type {
  Transaction,
  CreateTransactionDto,
  TransactionResponse
} from '../types/transaction.js';

const transactions = new Map<string, Transaction>();

export class TransactionService {
  private toResponse(transaction: Transaction): TransactionResponse {
    const { userId, ...response } = transaction;
    return response;
  }

  async create(userId: string, dto: CreateTransactionDto): Promise<TransactionResponse> {
    try {
      const amount = ethers.utils.parseUnits(dto.amount, 6);
      const { fee, netAmount } = await TransactionProcessor.processTransaction(
        amount,
        dto.type,
        null // Signer would be provided in a real implementation
      );

      const id = crypto.randomUUID();
      const now = Date.now();

      const transaction: Transaction = {
        id,
        userId,
        type: dto.type,
        amount: dto.amount,
        fee: ethers.utils.formatUnits(fee, 6),
        status: 'pending',
        timestamp: now,
      };

      transactions.set(id, transaction);
      logger.info('Transaction created', { transactionId: id, userId });

      return this.toResponse(transaction);
    } catch (error) {
      logger.error('Failed to create transaction', { error, userId });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<TransactionResponse[]> {
    return Array.from(transactions.values())
      .filter(tx => tx.userId === userId)
      .map(this.toResponse);
  }

  async findById(userId: string, id: string): Promise<TransactionResponse> {
    const transaction = transactions.get(id);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (transaction.userId !== userId) {
      throw new ValidationError('Transaction does not belong to user');
    }

    return this.toResponse(transaction);
  }
}