import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useCCIP } from '@/hooks/useCCIP';
import { useThirdwebSDK } from '@/hooks/useThirdwebSDK';
import { useNotifications } from '@/hooks/useNotifications';

vi.mock('@/hooks/useThirdwebSDK');
vi.mock('@/hooks/useNotifications');

describe('useCCIP', () => {
  const mockSigner = {
    getAddress: vi.fn().mockResolvedValue('0x123'),
  };

  const mockSDK = {
    getSigner: vi.fn().mockResolvedValue(mockSigner),
  };

  const mockAddNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useThirdwebSDK as any).mockReturnValue({ sdk: mockSDK });
    (useNotifications as any).mockReturnValue({ addNotification: mockAddNotification });
  });

  it('should send cross-chain data successfully', async () => {
    const { result } = renderHook(() => useCCIP());

    const mockResult = {
      messageId: '0x456',
      txHash: '0x789'
    };

    mockSDK.getSigner.mockImplementationOnce(() => ({
      ...mockSigner,
      sendMessage: vi.fn().mockResolvedValue(mockResult)
    }));

    await act(async () => {
      const res = await result.current.sendCrossChainData(
        'polygon',
        { test: 'data' }
      );
      expect(res).toEqual(mockResult);
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Cross-Chain Message Sent',
      message: expect.stringContaining(mockResult.messageId)
    });
  });

  it('should handle errors when sending cross-chain data', async () => {
    const error = new Error('Failed to send message');
    mockSDK.getSigner.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCCIP());

    await act(async () => {
      try {
        await result.current.sendCrossChainData('polygon', {});
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      message: 'Failed to send cross-chain data'
    });
  });
});