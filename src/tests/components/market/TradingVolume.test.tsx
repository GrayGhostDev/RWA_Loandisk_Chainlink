import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TradingVolume } from '@/components/market/TradingVolume';
import { useTokenVolume } from '@/hooks/useTokenVolume';

vi.mock('@/hooks/useTokenVolume');

describe('TradingVolume', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    (useTokenVolume as any).mockReturnValue({
      data: [],
      isLoading: true,
      error: null
    });

    render(<TradingVolume />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders chart with data', () => {
    const mockData = [
      { timestamp: Date.now(), volume: 1000000 },
      { timestamp: Date.now() - 3600000, volume: 2000000 }
    ];

    (useTokenVolume as any).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null
    });

    render(<TradingVolume />);
    expect(screen.getByText('Trading Volume')).toBeInTheDocument();
  });
});