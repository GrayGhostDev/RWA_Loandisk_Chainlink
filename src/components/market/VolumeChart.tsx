import React from 'react';
import { useTokenVolume } from '@/hooks/useTokenVolume';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const VolumeChart: React.FC = () => {
  const { data, isLoading, error } = useTokenVolume();

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center text-red-600">
          Error loading volume data: {error.message}
        </div>
      </Card>
    );
  }

  // Group data by timestamp
  const chartData = data.reduce((acc: any[], curr) => {
    const existingData = acc.find(d => d.timestamp === curr.timestamp);
    if (existingData) {
      existingData[curr.token] = curr.volume;
    } else {
      acc.push({
        timestamp: curr.timestamp,
        [curr.token]: curr.volume
      });
    }
    return acc;
  }, []);

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Trading Volume</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="USDT"
              stackId="1"
              stroke="#2563EB"
              fill="#3B82F6"
              fillOpacity={0.2}
              name="USDT Volume"
            />
            <Area
              type="monotone"
              dataKey="USDC"
              stackId="1"
              stroke="#16A34A"
              fill="#22C55E"
              fillOpacity={0.2}
              name="USDC Volume"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};