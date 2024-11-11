export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const WEB3_PROVIDER_URL = import.meta.env.VITE_WEB3_PROVIDER_URL;
export const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID);
export const USDT_CONTRACT_ADDRESS = import.meta.env.VITE_USDT_CONTRACT_ADDRESS;
export const USDC_CONTRACT_ADDRESS = import.meta.env.VITE_USDC_CONTRACT_ADDRESS;

export const TRANSACTION_TYPES = {
  DEPOSIT: '1',
  WITHDRAWAL: '2',
  INTEREST: '9',
  DIVIDEND: '10',
} as const;