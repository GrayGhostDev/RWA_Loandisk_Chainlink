import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '@/components/common/Alert';

describe('Alert', () => {
  it('renders with correct type styles', () => {
    const { rerender } = render(
      <Alert type="success">Success message</Alert>
    );
    expect(screen.getByText('Success message')).toHaveClass('bg-green-50');

    rerender(<Alert type="error">Error message</Alert>);
    expect(screen.getByText('Error message')).toHaveClass('bg-red-50');

    rerender(<Alert type="warning">Warning message</Alert>);
    expect(screen.getByText('Warning message')).toHaveClass('bg-yellow-50');

    rerender(<Alert type="info">Info message</Alert>);
    expect(screen.getByText('Info message')).toHaveClass('bg-blue-50');
  });

  it('displays title when provided', () => {
    render(
      <Alert type="info" title="Test Title">
        Test message
      </Alert>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Alert type="info" onClose={onClose}>
        Test message
      </Alert>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });
});