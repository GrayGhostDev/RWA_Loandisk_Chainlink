import React from 'react';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';

export const MarketStats: React.FC = () => {
  const { price: ethPrice, isLoading: ethLoading } = useChainlinkPrice(
    process.env.VITE_ETH_PRICE_FEED!
  );
  const { price: btcPrice, isLoading: btcLoading } = useChainlinkPrice(
    process.env.VITE_BTC_PRICE_FEED!
  );

  const formatPrice = (price: string | null) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(price));
  };

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Market Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">ETH/USD</span>
            {ethLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <span className="text-lg font-medium">{formatPrice(ethPrice)}</span>
            )}
          </div>
          <Badge variant="success" size="sm">24h: +2.45%</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">BTC/USD</span>
            {btcLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <span className="text-lg font-medium">{formatPrice(btcPrice)}</span>
            )}
          </div>
          <Badge variant="error" size="sm">24h: -1.23%</Badge>
        </div>
      </div>
    </Card>
  );
};