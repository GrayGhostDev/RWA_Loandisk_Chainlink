import React from 'react';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { Card } from '@/components/common/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const TransactionSummary: React.FC = () => {
  const { transactions } = useTransactionHistory();

  const dailyVolume = transactions.reduce((acc, tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + Number(tx.amount);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(dailyVolume).map(([date, volume]) => ({
    date,
    volume
  }));

  const totalVolume = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );

  const successRate = transactions.length
    ? (transactions.filter(tx => tx.status === 'completed').length / transactions.length) * 100
    : 0;

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Total Volume</p>
          <p className="text-2xl font-semibold">${totalVolume.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-semibold">{transactions.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-2xl font-semibold">{successRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#3B82F6"
              fill="#93C5FD"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};