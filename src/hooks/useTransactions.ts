import { useQuery } from 'react-query';
import { getSavingsTransactions } from '@/services/api/loandisk';
import type { Transaction } from '@/types';

export const useTransactions = (savingsId: string | null) => {
  return useQuery<Transaction[], Error>(
    ['transactions', savingsId],
    () => getSavingsTransactions(savingsId!),
    {
      enabled: !!savingsId,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );
};