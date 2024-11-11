import React, { useState } from 'react';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { TransactionSummary } from '@/components/transactions/TransactionSummary';
import { TransactionFilters, TransactionFilters as ITransactionFilters } from '@/components/transactions/TransactionFilters';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

const Activity: React.FC = () => {
  const [filters, setFilters] = useState<ITransactionFilters>({
    showDeposits: true,
    showWithdrawals: true,
    showPending: true,
    showCompleted: true,
    showFailed: true,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Activity</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TransactionSummary />
        </div>
        <div>
          <TransactionFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
      </div>

      <NotificationCenter />
      <TransactionHistory />
    </div>
  );
};