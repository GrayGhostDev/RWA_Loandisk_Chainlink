import React from 'react';
import { Card } from '@/components/common/Card';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useAppStore } from '@/store';
import { useTransactions } from '@/hooks/useTransactions';

const Transactions: React.FC = () => {
  const { selectedAccount } = useAppStore();
  const { data: transactions, isLoading } = useTransactions(
    selectedAccount?.accountNumber ?? null
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
      
      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
        {selectedAccount ? (
          <TransactionList 
            transactions={transactions ?? []} 
            isLoading={isLoading} 
          />
        ) : (
          <p className="text-sm text-gray-500">Please select an account to view transactions</p>
        )}
      </Card>
    </div>
  );
};

export default Transactions;