import { useState } from 'react';
import { ethers } from 'ethers';
import { useThirdwebSDK } from './useThirdwebSDK';
import { ChainlinkCCIP } from '@/services/chainlink/ccip';
import { useNotifications } from './useNotifications';

export const useCCIP = () => {
  const { sdk } = useThirdwebSDK();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendCrossChainData = async (
    destinationChain: string,
    payload: any,
    token?: string,
    amount?: string
  ) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const signer = await sdk.getSigner();
      const ccip = new ChainlinkCCIP(
        process.env.VITE_CCIP_BRIDGE_ADDRESS!,
        signer
      );

      const amountBN = amount ? ethers.utils.parseUnits(amount, 18) : undefined;
      const result = await ccip.sendCrossChainData(
        'ethereum',
        destinationChain,
        payload,
        token,
        amountBN
      );

      addNotification({
        type: 'success',
        title: 'Cross-Chain Message Sent',
        message: `Message ID: ${result.messageId}`
      });

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send cross-chain data');
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

  const checkMessageStatus = async (messageId: string) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const signer = await sdk.getSigner();
      const ccip = new ChainlinkCCIP(
        process.env.VITE_CCIP_BRIDGE_ADDRESS!,
        signer
      );

      const status = await ccip.getMessageStatus(messageId);
      return status;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check message status');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendCrossChainData,
    checkMessageStatus,
    isLoading,
    error
  };
};