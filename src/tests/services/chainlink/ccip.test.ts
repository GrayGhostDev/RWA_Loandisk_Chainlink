import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChainlinkCCIP } from '@/services/chainlink/ccip';
import { ethers } from 'ethers';

describe('ChainlinkCCIP', () => {
  let ccip: ChainlinkCCIP;
  const mockSigner = {
    getAddress: vi.fn().mockResolvedValue('0x123'),
    signMessage: vi.fn()
  };
  const mockContract = {
    sendMessage: vi.fn(),
    getMessageStatus: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ethers, 'Contract').mockImplementation(() => mockContract as any);
    ccip = new ChainlinkCCIP('0x456', mockSigner as any);
  });

  describe('sendCrossChainData', () => {
    it('should send message successfully', async () => {
      const mockReceipt = {
        transactionHash: '0x789',
        events: [{ args: { messageId: '0x123' } }]
      };
      mockContract.sendMessage.mockResolvedValueOnce({
        wait: vi.fn().mockResolvedValueOnce(mockReceipt)
      });

      const result = await ccip.sendCrossChainData(
        'ethereum',
        'polygon',
        { test: 'data' }
      );

      expect(result).toEqual({
        txHash: '0x789',
        messageId: '0x123'
      });
      expect(mockContract.sendMessage).toHaveBeenCalled();
    });

    it('should handle send errors', async () => {
      const error = new Error('Send failed');
      mockContract.sendMessage.mockRejectedValueOnce(error);

      await expect(ccip.sendCrossChainData(
        'ethereum',
        'polygon',
        { test: 'data' }
      )).rejects.toThrow(error);
    });
  });

  describe('getMessageStatus', () => {
    it('should return message status', async () => {
      const mockStatus = 'completed';
      mockContract.getMessageStatus.mockResolvedValueOnce(mockStatus);

      const result = await ccip.getMessageStatus('0x123');
      expect(result).toBe(mockStatus);
    });

    it('should handle status check errors', async () => {
      const error = new Error('Status check failed');
      mockContract.getMessageStatus.mockRejectedValueOnce(error);

      await expect(ccip.getMessageStatus('0x123')).rejects.toThrow(error);
    });
  });
});