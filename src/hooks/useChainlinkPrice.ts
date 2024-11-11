import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useThirdwebSDK } from './useThirdwebSDK';

const CHAINLINK_FEED_ABI = [
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() external view returns (uint8)',
];

export const useChainlinkPrice = (feedAddress: string) => {
  const { sdk } = useThirdwebSDK();
  const [price, setPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!sdk || !feedAddress) return;

      try {
        setIsLoading(true);
        setError(null);

        const provider = sdk.getProvider();
        const feed = new ethers.Contract(feedAddress, CHAINLINK_FEED_ABI, provider);
        
        const [roundData, decimals] = await Promise.all([
          feed.latestRoundData(),
          feed.decimals(),
        ]);

        const formattedPrice = ethers.utils.formatUnits(roundData.answer, decimals);
        setPrice(formattedPrice);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch price'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [sdk, feedAddress]);

  return { price, isLoading, error };
};