import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionService } from '../../../services/transactionService.js';
import { TransactionProcessor } from '../../../services/transaction/processor.js';
import { NotFoundError, ValidationError } from '../../../utils/errors.js';
import { ethers } from 'ethers';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    service = new TransactionService();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('creates a transaction successfully', async () => {
      const mockProcessResult = {
        amount: ethers.utils.parseUnits('100', 6),
        fee: ethers.utils.parseUnits('1', 6),
        netAmount: ethers.utils.parseUnits('99', 6)
      };

      vi.spyOn(TransactionProcessor, 'processTransaction')
        .mockResolvedValueOnce(mockProcessResult);

      const result = await service.create('user123', {
        type: 'DEPOSIT',
        amount: '100'
      });

      expect(result).toMatchObject({
        type: 'DEPOSIT',
        amount: '100',
        status: 'pending'
      });
    });

    it('handles processing errors', async () => {
      vi.spyOn(TransactionProcessor, 'processTransaction')
        .mockRejectedValueOnce(new Error('Processing failed'));

      await expect(service.create('user123', {
        type: 'DEPOSIT',
        amount: '100'
      })).rejects.toThrow('Processing failed');
    });
  });

  describe('findByUserId', () => {
    it('returns user transactions', async () => {
      // First create some transactions
      await service.create('user123', {
        type: 'DEPOSIT',
        amount: '100'
      });

      const transactions = await service.findByUserId('user123');
      expect(transactions.length).toBeGreaterThan(0);
      expect(transactions[0]).toHaveProperty('type', 'DEPOSIT');
    });

    it('returns empty array for user with no transactions', async () => {
      const transactions = await service.findByUserId('non-existent');
      expect(transactions).toEqual([]);
    });
  });

  describe('findById', () => {
    it('returns transaction by id', async () => {
      const created = await service.create('user123', {
        type: 'DEPOSIT',
        amount: '100'
      });

      const found = await service.findById('user123', created.id);
      expect(found).toEqual(created);
    });

    it('throws NotFoundError for non-existent transaction', async () => {
      await expect(service.findById('user123', 'non-existent'))
        .rejects.toThrow(NotFoundError);
    });

    it('throws ValidationError for unauthorized access', async () => {
      const created = await service.create('user123', {
        type: 'DEPOSIT',
        amount: '100'
      });

      await expect(service.findById('other-user', created.id))
        .rejects.toThrow(ValidationError);
    });
  });
});