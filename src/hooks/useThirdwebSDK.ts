import { useEffect, useState } from 'react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useWallet } from './useWallet';
import { getSDK } from '@/config/thirdweb';

export const useThirdwebSDK = () => {
  const { address, signer } = useWallet();
  const [sdk, setSDK] = useState<ThirdwebSDK | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      if (!signer) {
        setSDK(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const newSDK = await getSDK(signer);
        setSDK(newSDK);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize SDK'));
        setSDK(null);
      } finally {
        setIsLoading(false);
      }
    };

    initSDK();
  }, [signer]);

  return { sdk, isLoading, error };
};