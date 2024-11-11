import React from 'react';
import { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (!transactions.length) {
    return <div className="text-center py-4 text-gray-500">No transactions found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${transaction.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};