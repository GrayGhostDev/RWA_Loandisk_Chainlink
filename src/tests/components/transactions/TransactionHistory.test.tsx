import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';

vi.mock('@/hooks/useTransactionHistory');

describe('TransactionHistory', () => {
  const mockTransactions = [
    {
      id: '1',
      hash: '0x123',
      type: 'DEPOSIT',
      amount: '100',
      fee: '0.1',
      status: 'completed',
      timestamp: Date.now(),
    },
    {
      id: '2',
      hash: '0x456',
      type: 'WITHDRAWAL',
      amount: '50',
      fee: '0.05',
      status: 'pending',
      timestamp: Date.now(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    (useTransactionHistory as any).mockReturnValue({
      transactions: [],
      isLoading: true,
      error: null,
    });

    render(<TransactionHistory />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders transactions', () => {
    (useTransactionHistory as any).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
      error: null,
    });

    render(<TransactionHistory />);
    expect(screen.getByText('DEPOSIT')).toBeInTheDocument();
    expect(screen.getByText('WITHDRAWAL')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Failed to load transactions');
    (useTransactionHistory as any).mockReturnValue({
      transactions: [],
      isLoading: false,
      error,
    });

    render(<TransactionHistory />);
    expect(screen.getByText(/Failed to load transactions/)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (useTransactionHistory as any).mockReturnValue({
      transactions: [],
      isLoading: false,
      error: null,
    });

    render(<TransactionHistory />);
    expect(screen.getByText('No transactions found')).toBeInTheDocument();
  });
});