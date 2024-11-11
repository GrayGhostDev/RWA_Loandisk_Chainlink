import React from 'react';
import { Card } from '@/components/common/Card';
import { Switch } from '@/components/common/Switch';

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionFilters) => void;
  filters: TransactionFilters;
}

export interface TransactionFilters {
  showDeposits: boolean;
  showWithdrawals: boolean;
  showPending: boolean;
  showCompleted: boolean;
  showFailed: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  onFilterChange,
  filters
}) => {
  const handleFilterChange = (key: keyof TransactionFilters) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key]
    });
  };

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-4">
        <Switch
          checked={filters.showDeposits}
          onChange={() => handleFilterChange('showDeposits')}
          label="Show Deposits"
        />
        
        <Switch
          checked={filters.showWithdrawals}
          onChange={() => handleFilterChange('showWithdrawals')}
          label="Show Withdrawals"
        />
        
        <Switch
          checked={filters.showPending}
          onChange={() => handleFilterChange('showPending')}
          label="Show Pending"
        />
        
        <Switch
          checked={filters.showCompleted}
          onChange={() => handleFilterChange('showCompleted')}
          label="Show Completed"
        />
        
        <Switch
          checked={filters.showFailed}
          onChange={() => handleFilterChange('showFailed')}
          label="Show Failed"
        />
      </div>
    </Card>
  );
};