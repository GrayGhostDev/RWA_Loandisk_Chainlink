import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TokenList } from '@/components/market/TokenList';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';

vi.mock('@/hooks/useChainlinkPrice');

describe('TokenList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders token list correctly', () => {
    (useChainlinkPrice as any).mockReturnValue({
      price: '1.00',
      isLoading: false,
      error: null
    });

    render(<TokenList />);
    expect(screen.getByText('USDT')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    (useChainlinkPrice as any).mockReturnValue({
      price: null,
      isLoading: true,
      error: null
    });

    render(<TokenList />);
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });

  it('shows token prices', () => {
    (useChainlinkPrice as any).mockReturnValue({
      price: '1.0001',
      isLoading: false,
      error: null
    });

    render(<TokenList />);
    expect(screen.getAllByText('$1.0001')).toHaveLength(2);
  });
});