import { describe, it, expect, vi } from 'vitest';
import { ethers } from 'ethers';
import { TransactionProcessor } from '@/services/transaction/processor';
import { ValidationError } from '@/utils/errors';

describe('TransactionProcessor', () => {
  const mockSigner = {
    getAddress: vi.fn().mockResolvedValue('0x123'),
    signMessage: vi.fn()
  };

  describe('validateTransaction', () => {
    it('validates transaction amount within limits', () => {
      const validAmount = ethers.utils.parseUnits('100', 6);
      expect(() => 
        TransactionProcessor.validateTransaction(validAmount, 'DEPOSIT')
      ).not.toThrow();
    });

    it('throws error for amount below minimum', () => {
      const lowAmount = ethers.utils.parseUnits('0.001', 6);
      expect(() => 
        TransactionProcessor.validateTransaction(lowAmount, 'DEPOSIT')
      ).toThrow(ValidationError);
    });

    it('throws error for amount above maximum', () => {
      const highAmount = ethers.utils.parseUnits('1000000', 6);
      expect(() => 
        TransactionProcessor.validateTransaction(highAmount, 'DEPOSIT')
      ).toThrow(ValidationError);
    });
  });

  describe('calculateFee', () => {
    it('calculates fee correctly', () => {
      const amount = ethers.utils.parseUnits('1000', 6);
      const fee = TransactionProcessor.calculateFee(amount);
      expect(ethers.utils.formatUnits(fee, 6)).toBe('1.0');
    });
  });

  describe('processTransaction', () => {
    it('processes transaction successfully', async () => {
      const amount = ethers.utils.parseUnits('1000', 6);
      const result = await TransactionProcessor.processTransaction(
        amount,
        'DEPOSIT',
        mockSigner as any
      );

      expect(result).toEqual({
        amount,
        fee: expect.any(ethers.BigNumber),
        netAmount: expect.any(ethers.BigNumber),
      });
    });
  });
});