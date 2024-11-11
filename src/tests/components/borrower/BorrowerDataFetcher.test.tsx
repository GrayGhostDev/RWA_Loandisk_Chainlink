import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BorrowerDataFetcher } from '@/components/borrower/BorrowerDataFetcher';
import { useChainlinkFunctions } from '@/hooks/useChainlinkFunctions';

vi.mock('@/hooks/useChainlinkFunctions');

describe('BorrowerDataFetcher', () => {
  const mockFetchData = vi.fn();
  const mockOnDataFetched = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useChainlinkFunctions as any).mockReturnValue({
      fetchBorrowerData: mockFetchData,
      isLoading: false,
      error: null
    });
  });

  it('renders correctly', () => {
    render(<BorrowerDataFetcher onDataFetched={mockOnDataFetched} />);
    expect(screen.getByText('Fetch Borrower Data')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter borrower ID')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockResult = { data: 'test' };
    mockFetchData.mockResolvedValueOnce(mockResult);

    render(<BorrowerDataFetcher onDataFetched={mockOnDataFetched} />);

    const input = screen.getByPlaceholderText('Enter borrower ID');
    const button = screen.getByText('Fetch Data');

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledWith('123');
      expect(mockOnDataFetched).toHaveBeenCalledWith(mockResult);
    });
  });

  it('displays error message', () => {
    const error = new Error('Test error');
    (useChainlinkFunctions as any).mockReturnValue({
      fetchBorrowerData: mockFetchData,
      isLoading: false,
      error
    });

    render(<BorrowerDataFetcher onDataFetched={mockOnDataFetched} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('disables form during loading', () => {
    (useChainlinkFunctions as any).mockReturnValue({
      fetchBorrowerData: mockFetchData,
      isLoading: true,
      error: null
    });

    render(<BorrowerDataFetcher onDataFetched={mockOnDataFetched} />);
    
    const input = screen.getByPlaceholderText('Enter borrower ID');
    const button = screen.getByText('Fetching...');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});