import { useState } from 'react';
import { ethers } from 'ethers';
import { TransactionProcessor } from '@/services/transaction/processor';
import { useThirdwebSDK } from './useThirdwebSDK';
import { useNotifications } from './useNotifications';
import { TransactionType } from '@/types/transaction';

export const useTransactionProcessor = () => {
  const { sdk } = useThirdwebSDK();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);

  const processTransaction = async (
    amount: string,
    type: TransactionType
  ) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      setIsProcessing(true);
      const signer = await sdk.getSigner();
      const parsedAmount = ethers.utils.parseUnits(amount, 6);

      const result = await TransactionProcessor.processTransaction(
        parsedAmount,
        type,
        signer
      );

      addNotification({
        type: 'success',
        title: 'Transaction Processed',
        message: `Successfully processed ${amount} ${type}`,
      });

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaction failed';
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message,
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processTransaction,
    isProcessing,
  };
};