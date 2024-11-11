import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import { ethers } from 'ethers';

// Mock TextEncoder/Decoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ethers provider
vi.mock('ethers', async () => {
  const actual = await vi.importActual('ethers');
  return {
    ...actual,
    providers: {
      JsonRpcProvider: vi.fn().mockImplementation(() => ({
        getNetwork: vi.fn().mockResolvedValue({ chainId: 1 }),
        getBlockNumber: vi.fn().mockResolvedValue(1000000),
        getBlock: vi.fn().mockResolvedValue({
          timestamp: Date.now() / 1000,
          transactions: []
        }),
      }))
    }
  };
});