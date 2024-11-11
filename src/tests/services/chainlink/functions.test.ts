import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChainlinkFunctions } from '@/services/chainlink/functions';
import { ethers } from 'ethers';

describe('ChainlinkFunctions', () => {
  let functions: ChainlinkFunctions;
  const mockSigner = {
    getAddress: vi.fn().mockResolvedValue('0x123'),
    signMessage: vi.fn()
  };
  const mockContract = {
    executeRequest: vi.fn(),
    lastResponse: vi.fn(),
    lastError: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ethers, 'Contract').mockImplementation(() => mockContract as any);
    functions = new ChainlinkFunctions('0x456', mockSigner as any);
  });

  describe('fetchBorrowerData', () => {
    it('should execute request successfully', async () => {
      const mockReceipt = { hash: '0x789' };
      mockContract.executeRequest.mockResolvedValueOnce({
        wait: vi.fn().mockResolvedValueOnce(mockReceipt)
      });

      const result = await functions.fetchBorrowerData('123');
      expect(result).toEqual(mockReceipt);
      expect(mockContract.executeRequest).toHaveBeenCalled();
    });

    it('should handle execution errors', async () => {
      const error = new Error('Execution failed');
      mockContract.executeRequest.mockRejectedValueOnce(error);

      await expect(functions.fetchBorrowerData('123')).rejects.toThrow(error);
    });
  });

  describe('getLastResponse', () => {
    it('should return last response', async () => {
      const mockResponse = '0x123';
      mockContract.lastResponse.mockResolvedValueOnce(mockResponse);

      const result = await functions.getLastResponse();
      expect(result).toBe(mockResponse);
    });
  });

  describe('getLastError', () => {
    it('should return last error', async () => {
      const mockError = '0x456';
      mockContract.lastError.mockResolvedValueOnce(mockError);

      const result = await functions.getLastError();
      expect(result).toBe(mockError);
    });
  });
});