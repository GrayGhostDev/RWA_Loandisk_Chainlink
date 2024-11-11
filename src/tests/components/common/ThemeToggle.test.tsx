import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

vi.mock('@/hooks/useTheme');

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders light mode icon when theme is dark', () => {
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn()
    });

    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders dark mode icon when theme is light', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn()
    });

    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    const toggleTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: 'light',
      toggleTheme
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(toggleTheme).toHaveBeenCalled();
  });
});