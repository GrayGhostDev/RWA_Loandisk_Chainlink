import React, { useState } from 'react';
import { useTransactionProcessor } from '@/hooks/useTransactionProcessor';
import { TransactionType } from '@/types/transaction';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface TransactionFormProps {
  type: TransactionType;
  maxAmount?: string;
  onSuccess?: (result: any) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  maxAmount,
  onSuccess
}) => {
  const { processTransaction, isProcessing } = useTransactionProcessor();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isProcessing) return;

    try {
      setError(null);
      const result = await processTransaction(amount, type);
      setAmount('');
      onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {type.charAt(0) + type.slice(1).toLowerCase()}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="amount" 
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              max={maxAmount}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              disabled={isProcessing}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          disabled={!amount || isProcessing || Number(amount) > Number(maxAmount)}
          className="w-full"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </span>
          ) : (
            `Process ${type.toLowerCase()}`
          )}
        </Button>
      </form>
    </Card>
  );
};