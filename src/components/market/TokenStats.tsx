import React from 'react';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface TokenStatsProps {
  tokenAddress: string;
  priceFeedAddress: string;
  symbol: string;
}

export const TokenStats: React.FC<TokenStatsProps> = ({
  tokenAddress,
  priceFeedAddress,
  symbol
}) => {
  const { balance, isLoading: balanceLoading } = useTokenBalance(tokenAddress);
  const { price, isLoading: priceLoading } = useChainlinkPrice(priceFeedAddress);

  const isLoading = balanceLoading || priceLoading;

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  const value = Number(balance) * (Number(price) || 1);
  const priceChange = (Math.random() * 2 - 1) * 0.001; // Mock 24h change

  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{symbol}</h3>
          <p className="text-sm text-gray-500">Your Holdings</p>
        </div>
        <Badge
          variant={priceChange >= 0 ? 'success' : 'error'}
          size="lg"
        >
          {priceChange >= 0 ? '+' : ''}
          {(priceChange * 100).toFixed(2)}%
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-2xl font-bold">
            {Number(balance).toLocaleString()} {symbol}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Value</p>
          <p className="text-2xl font-bold">
            ${value.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-lg font-medium">
            ${Number(price).toFixed(4)}
          </p>
        </div>
      </div>
    </Card>
  );
};