import { useState, useEffect } from 'react';
import { useThirdwebSDK } from './useThirdwebSDK';
import { useWallet } from './useWallet';
import { USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '@/config/constants';

export const useTokenBalance = (tokenAddress: string) => {
  const { sdk } = useThirdwebSDK();
  const { address } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!sdk || !address || !tokenAddress) return;

      try {
        setIsLoading(true);
        setError(null);
        const contract = await sdk.getContract(tokenAddress);
        const balance = await contract.erc20.balanceOf(address);
        setBalance(balance.displayValue);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch balance'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [sdk, address, tokenAddress]);

  return { balance, isLoading, error };
};

export const useUSDTBalance = () => {
  return useTokenBalance(USDT_CONTRACT_ADDRESS);
};

export const useUSDCBalance = () => {
  return useTokenBalance(USDC_CONTRACT_ADDRESS);
};