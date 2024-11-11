import React from 'react';
import { useMarketStats } from '@/hooks/useMarketStats';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const MarketOverview: React.FC = () => {
  const { stats, isLoading, error } = useMarketStats();

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
          Error loading market data: {error.message}
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">USDT Market</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Supply</span>
              <span className="text-lg font-medium">
                {Number(stats.totalSupply.USDT).toLocaleString()} USDT
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">24h Volume</span>
              <span className="text-lg font-medium">
                ${stats.volume24h.USDT.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">24h Change</span>
              <Badge
                variant={stats.priceChange24h.USDT >= 0 ? 'success' : 'error'}
              >
                {stats.priceChange24h.USDT >= 0 ? '+' : ''}
                {(stats.priceChange24h.USDT * 100).toFixed(2)}%
              </Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">USDC Market</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Supply</span>
              <span className="text-lg font-medium">
                {Number(stats.totalSupply.USDC).toLocaleString()} USDC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">24h Volume</span>
              <span className="text-lg font-medium">
                ${stats.volume24h.USDC.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">24h Change</span>
              <Badge
                variant={stats.priceChange24h.USDC >= 0 ? 'success' : 'error'}
              >
                {stats.priceChange24h.USDC >= 0 ? '+' : ''}
                {(stats.priceChange24h.USDC * 100).toFixed(2)}%
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Volume Comparison</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'USDT', value: stats.volume24h.USDT },
              { name: 'USDC', value: stats.volume24h.USDC }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#93C5FD"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};