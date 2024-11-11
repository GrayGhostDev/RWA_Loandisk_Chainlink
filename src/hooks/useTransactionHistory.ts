import { useState, useEffect } from 'react';
import { useThirdwebSDK } from './useThirdwebSDK';
import { useWallet } from './useWallet';
import { ethers } from 'ethers';
import { Transaction } from '@/types/transaction';

export const useTransactionHistory = () => {
  const { sdk } = useThirdwebSDK();
  const { address } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!sdk || !address) return;

      try {
        setIsLoading(true);
        setError(null);

        const provider = sdk.getProvider();
        const blockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(blockNumber);
        
        const txs = await Promise.all(
          block.transactions.map(async (txHash) => {
            const tx = await provider.getTransaction(txHash);
            const receipt = await provider.getTransactionReceipt(txHash);
            
            if (tx.from.toLowerCase() !== address.toLowerCase() && 
                tx.to?.toLowerCase() !== address.toLowerCase()) {
              return null;
            }

            return {
              id: tx.hash,
              hash: tx.hash,
              from: tx.from,
              to: tx.to || '',
              amount: ethers.utils.formatEther(tx.value),
              fee: ethers.utils.formatEther(tx.gasPrice.mul(receipt.gasUsed)),
              status: receipt.status === 1 ? 'completed' : 'failed',
              timestamp: block.timestamp * 1000,
              type: tx.from.toLowerCase() === address.toLowerCase() ? 'WITHDRAWAL' : 'DEPOSIT'
            };
          })
        );

        setTransactions(txs.filter((tx): tx is Transaction => tx !== null));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000); // Refresh every 15s

    return () => clearInterval(interval);
  }, [sdk, address]);

  return { transactions, isLoading, error };
};