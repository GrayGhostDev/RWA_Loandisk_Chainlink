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
import { useTokenVolume } from '@/hooks/useTokenVolume';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const TradingVolume: React.FC = () => {
  const { data, isLoading } = useTokenVolume();

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Trading Volume</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
            />
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