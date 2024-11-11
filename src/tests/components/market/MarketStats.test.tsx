import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketStats } from '@/components/market/MarketStats';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';

vi.mock('@/hooks/useChainlinkPrice');

describe('MarketStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    (useChainlinkPrice as any).mockReturnValue({
      price: null,
      isLoading: true,
      error: null
    });

    render(<MarketStats />);
    expect(screen.getAllByText('Loading...')).toHaveLength(2);
  });

  it('renders prices correctly', () => {
    (useChainlinkPrice as any)
      .mockReturnValueOnce({
        price: '1800.50',
        isLoading: false,
        error: null
      })
      .mockReturnValueOnce({
        price: '35000.75',
        isLoading: false,
        error: null
      });

    render(<MarketStats />);
    expect(screen.getByText('$1,800.50')).toBeInTheDocument();
    expect(screen.getByText('$35,000.75')).toBeInTheDocument();
  });

  it('displays 24h changes', () => {
    (useChainlinkPrice as any).mockReturnValue({
      price: '1.00',
      isLoading: false,
      error: null
    });

    render(<MarketStats />);
    expect(screen.getByText('24h: +2.45%')).toBeInTheDocument();
    expect(screen.getByText('24h: -1.23%')).toBeInTheDocument();
  });
});