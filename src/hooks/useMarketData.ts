import { useState, useEffect } from 'react';
import { useThirdwebSDK } from './useThirdwebSDK';
import { useChainlinkPrice } from './useChainlinkPrice';

interface MarketData {
  symbol: string;
  price: string;
  priceChange24h: number;
  volume24h: string;
  marketCap: string;
}

export const useMarketData = (
  symbol: string,
  priceFeedAddress: string,
  tokenAddress: string
) => {
  const { sdk } = useThirdwebSDK();
  const { price, isLoading: priceLoading } = useChainlinkPrice(priceFeedAddress);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!sdk || !price) return;

      try {
        setIsLoading(true);
        setError(null);

        // In a real application, fetch this data from an API
        // This is mock data for demonstration
        const mockData: MarketData = {
          symbol,
          price,
          priceChange24h: Math.random() * 2 - 1, // Random change between -1% and 1%
          volume24h: (Math.random() * 1000000000).toFixed(2),
          marketCap: (Number(price) * 1000000000).toFixed(2),
        };

        setMarketData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch market data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [sdk, price, symbol]);

  return {
    marketData,
    isLoading: isLoading || priceLoading,
    error,
  };
};