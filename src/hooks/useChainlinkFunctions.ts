import { useState } from 'react';
import { useThirdwebSDK } from './useThirdwebSDK';
import { ChainlinkFunctions } from '@/services/chainlink/functions';
import { useNotifications } from './useNotifications';

export const useChainlinkFunctions = () => {
  const { sdk } = useThirdwebSDK();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBorrowerData = async (borrowerId: string) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const signer = await sdk.getSigner();
      const functions = new ChainlinkFunctions(
        process.env.VITE_LOANDISK_ORACLE_ADDRESS!,
        signer
      );

      const result = await functions.fetchBorrowerData(borrowerId);
      
      addNotification({
        type: 'success',
        title: 'Data Fetched',
        message: 'Successfully fetched borrower data'
      });

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch borrower data');
      setError(error);
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchBorrowerData,
    isLoading,
    error
  };
};