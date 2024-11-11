import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useChainlinkFunctions } from '@/hooks/useChainlinkFunctions';
import { useThirdwebSDK } from '@/hooks/useThirdwebSDK';
import { useNotifications } from '@/hooks/useNotifications';

vi.mock('@/hooks/useThirdwebSDK');
vi.mock('@/hooks/useNotifications');

describe('useChainlinkFunctions', () => {
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

  it('should fetch borrower data successfully', async () => {
    const { result } = renderHook(() => useChainlinkFunctions());

    await act(async () => {
      await result.current.fetchBorrowerData('123');
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Data Fetched',
      message: 'Successfully fetched borrower data'
    });
  });

  it('should handle errors when fetching borrower data', async () => {
    const error = new Error('Failed to fetch');
    mockSDK.getSigner.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useChainlinkFunctions());

    await act(async () => {
      try {
        await result.current.fetchBorrowerData('123');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      message: 'Failed to fetch borrower data'
    });
  });
});