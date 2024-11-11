import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useConversion } from '@/hooks/useConversion';
import { useThirdwebSDK } from '@/hooks/useThirdwebSDK';
import { useNotifications } from '@/hooks/useNotifications';

vi.mock('@/hooks/useThirdwebSDK');
vi.mock('@/hooks/useNotifications');

describe('useConversion', () => {
  const mockContract = {
    erc20: {
      mint: vi.fn().mockResolvedValue({
        wait: vi.fn().mockResolvedValue(true)
      })
    }
  };

  const mockSDK = {
    getContract: vi.fn().mockResolvedValue(mockContract),
    getSigner: vi.fn()
  };

  const mockAddNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useThirdwebSDK as any).mockReturnValue({ sdk: mockSDK });
    (useNotifications as any).mockReturnValue({ addNotification: mockAddNotification });
  });

  it('should convert tokens successfully', async () => {
    const { result } = renderHook(() => useConversion());

    await act(async () => {
      await result.current.convert(100, 'USDT');
    });

    expect(mockContract.erc20.mint).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Conversion Successful',
      message: 'Successfully converted 100 to USDT'
    });
  });

  it('should handle conversion errors', async () => {
    const error = new Error('Conversion failed');
    mockContract.erc20.mint.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useConversion());

    await act(async () => {
      try {
        await result.current.convert(100, 'USDT');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'error',
      title: 'Conversion Failed',
      message: 'Conversion failed'
    });
  });
});