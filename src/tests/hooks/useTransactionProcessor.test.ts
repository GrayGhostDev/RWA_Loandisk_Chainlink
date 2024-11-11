import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useTransactionProcessor } from '@/hooks/useTransactionProcessor';
import { useThirdwebSDK } from '@/hooks/useThirdwebSDK';
import { useNotifications } from '@/hooks/useNotifications';

vi.mock('@/hooks/useThirdwebSDK');
vi.mock('@/hooks/useNotifications');

describe('useTransactionProcessor', () => {
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

  it('processes transaction successfully', async () => {
    const { result } = renderHook(() => useTransactionProcessor());

    await act(async () => {
      await result.current.processTransaction('100', 'DEPOSIT');
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Transaction Processed',
      message: expect.stringContaining('100'),
    });
  });

  it('handles transaction errors', async () => {
    const error = new Error('Processing failed');
    mockSDK.getSigner.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useTransactionProcessor());

    await act(async () => {
      try {
        await result.current.processTransaction('100', 'DEPOSIT');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'error',
      title: 'Transaction Failed',
      message: 'Processing failed',
    });
  });
});