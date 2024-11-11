import { useState, useEffect } from 'react';
import { useThirdwebSDK } from './useThirdwebSDK';
import { useChainlinkPrice } from './useChainlinkPrice';
import { USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '@/config/constants';

interface MarketStats {
  totalSupply: {
    USDT: string;
    USDC: string;
  };
  priceChange24h: {
    USDT: number;
    USDC: number;
  };
  volume24h: {
    USDT: number;
    USDC: number;
  };
}

export const useMarketStats = () => {
  const { sdk } = useThirdwebSDK();
  const { price: usdtPrice } = useChainlinkPrice(process.env.VITE_USDT_PRICE_FEED!);
  const { price: usdcPrice } = useChainlinkPrice(process.env.VITE_USDC_PRICE_FEED!);
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!sdk) return;

      try {
        setIsLoading(true);
        setError(null);

        const [usdtContract, usdcContract] = await Promise.all([
          sdk.getContract(USDT_CONTRACT_ADDRESS),
          sdk.getContract(USDC_CONTRACT_ADDRESS)
        ]);

        const [usdtSupply, usdcSupply] = await Promise.all([
          usdtContract.erc20.totalSupply(),
          usdcContract.erc20.totalSupply()
        ]);

        // In a real application, fetch historical prices from an API
        const mockPriceChange = () => (Math.random() * 2 - 1) * 0.001; // ±0.1%

        setStats({
          totalSupply: {
            USDT: usdtSupply.displayValue,
            USDC: usdcSupply.displayValue
          },
          priceChange24h: {
            USDT: mockPriceChange(),
            USDC: mockPriceChange()
          },
          volume24h: {
            USDT: Math.random() * 1000000,
            USDC: Math.random() * 1000000
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch market stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [sdk, usdtPrice, usdcPrice]);

  return { stats, isLoading, error };
};