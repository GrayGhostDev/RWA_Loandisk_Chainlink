import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface Token {
  symbol: string;
  name: string;
  priceFeed: string;
  icon: string;
}

const TOKENS: Token[] = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    priceFeed: process.env.VITE_USDT_PRICE_FEED!,
    icon: '💵',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    priceFeed: process.env.VITE_USDC_PRICE_FEED!,
    icon: '💰',
  },
];

export const TokenList: React.FC = () => {
  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Tokens</h2>
      
      <div className="space-y-4">
        {TOKENS.map((token) => (
          <TokenRow key={token.symbol} token={token} />
        ))}
      </div>
    </Card>
  );
};

const TokenRow: React.FC<{ token: Token }> = ({ token }) => {
  const { price, isLoading } = useChainlinkPrice(token.priceFeed);

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{token.icon}</span>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{token.symbol}</h3>
          <p className="text-xs text-gray-500">{token.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <p className="text-sm font-medium">${Number(price).toFixed(4)}</p>
            <Badge
              variant={Math.random() > 0.5 ? 'success' : 'error'}
              size="sm"
            >
              {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
            </Badge>
          </>
        )}
      </div>
    </div>
  );
};