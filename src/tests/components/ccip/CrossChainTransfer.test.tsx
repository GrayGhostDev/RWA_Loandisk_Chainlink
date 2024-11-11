import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CrossChainTransfer } from '@/components/ccip/CrossChainTransfer';
import { useCCIP } from '@/hooks/useCCIP';

vi.mock('@/hooks/useCCIP');

describe('CrossChainTransfer', () => {
  const mockSendData = vi.fn();
  const mockCheckStatus = vi.fn();
  const mockOnTransferComplete = vi.fn();

  const defaultProps = {
    borrowerId: '123',
    loanData: { amount: 1000 },
    onTransferComplete: mockOnTransferComplete
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCCIP as any).mockReturnValue({
      sendCrossChainData: mockSendData,
      checkMessageStatus: mockCheckStatus,
      isLoading: false
    });
  });

  it('renders correctly', () => {
    render(<CrossChainTransfer {...defaultProps} />);
    expect(screen.getByText('Cross-Chain Transfer')).toBeInTheDocument();
    expect(screen.getByText('Destination Chain')).toBeInTheDocument();
  });

  it('handles transfer initiation', async () => {
    const mockResult = { messageId: '0x123' };
    mockSendData.mockResolvedValueOnce(mockResult);

    render(<CrossChainTransfer {...defaultProps} />);

    const button = screen.getByText('Send Cross-Chain');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSendData).toHaveBeenCalledWith(
        'polygon',
        expect.objectContaining({
          borrowerId: '123',
          loanData: { amount: 1000 }
        })
      );
      expect(mockOnTransferComplete).toHaveBeenCalledWith(mockResult);
    });
  });

  it('displays loading state during transfer', () => {
    (useCCIP as any).mockReturnValue({
      sendCrossChainData: mockSendData,
      checkMessageStatus: mockCheckStatus,
      isLoading: true
    });

    render(<CrossChainTransfer {...defaultProps} />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('handles chain selection', () => {
    render(<CrossChainTransfer {...defaultProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'optimism' } });

    expect(select).toHaveValue('optimism');
  });

  it('displays message status after transfer', async () => {
    mockSendData.mockResolvedValueOnce({ messageId: '0x123' });
    mockCheckStatus.mockResolvedValueOnce('completed');

    render(<CrossChainTransfer {...defaultProps} />);

    const button = screen.getByText('Send Cross-Chain');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });
});