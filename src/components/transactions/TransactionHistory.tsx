import React from 'react';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

export const TransactionHistory: React.FC = () => {
  const { transactions, isLoading, error } = useTransactionHistory();

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-4 text-red-600">
          Error loading transactions: {error.message}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No transactions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.hash} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={tx.type === 'DEPOSIT' ? 'success' : 'primary'}
                      size="sm"
                    >
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      ${Number(tx.amount).toFixed(6)}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      Fee: ${Number(tx.fee).toFixed(6)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={tx.status === 'completed' ? 'success' : 'error'}
                      size="sm"
                    >
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};