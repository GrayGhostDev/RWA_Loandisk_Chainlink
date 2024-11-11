import React from 'react';
import { Card } from '@/components/common/Card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface TokenChartProps {
  tokenSymbol: string;
  priceFeedAddress: string;
}

export const TokenChart: React.FC<TokenChartProps> = ({
  tokenSymbol,
  priceFeedAddress,
}) => {
  const { price, isLoading } = useChainlinkPrice(priceFeedAddress);

  // Mock historical data - in production, fetch from an API
  const data = [
    { timestamp: '00:00', price: 1.00 },
    { timestamp: '04:00', price: 1.01 },
    { timestamp: '08:00', price: 0.99 },
    { timestamp: '12:00', price: 1.02 },
    { timestamp: '16:00', price: 1.01 },
    { timestamp: '20:00', price: Number(price) || 1.00 },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {tokenSymbol} Price Chart
        </h3>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <span className="text-2xl font-bold">${price}</span>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="price"
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