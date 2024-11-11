import { useState, useEffect } from 'react';
import { useThirdwebSDK } from './useThirdwebSDK';
import { USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '@/config/constants';

interface VolumeData {
  timestamp: number;
  volume: number;
  token: string;
}

export const useTokenVolume = () => {
  const { sdk } = useThirdwebSDK();
  const [data, setData] = useState<VolumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVolume = async () => {
      if (!sdk) return;

      try {
        setIsLoading(true);
        setError(null);

        const [usdtContract, usdcContract] = await Promise.all([
          sdk.getContract(USDT_CONTRACT_ADDRESS),
          sdk.getContract(USDC_CONTRACT_ADDRESS)
        ]);

        // Get transfer events for the last 24 hours
        const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
        const [usdtEvents, usdcEvents] = await Promise.all([
          usdtContract.events.getEvents('Transfer', { fromBlock: oneDayAgo }),
          usdcContract.events.getEvents('Transfer', { fromBlock: oneDayAgo })
        ]);

        // Process events into hourly volumes
        const volumes: VolumeData[] = [];
        const processEvents = (events: any[], token: string) => {
          events.forEach(event => {
            const hour = Math.floor(event.data.timestamp / 3600) * 3600;
            volumes.push({
              timestamp: hour * 1000,
              volume: parseFloat(event.data.value),
              token
            });
          });
        };

        processEvents(usdtEvents, 'USDT');
        processEvents(usdcEvents, 'USDC');

        setData(volumes.sort((a, b) => a.timestamp - b.timestamp));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch volume data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolume();
    const interval = setInterval(fetchVolume, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [sdk]);

  return { data, isLoading, error };
};