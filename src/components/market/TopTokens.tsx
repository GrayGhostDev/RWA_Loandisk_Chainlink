import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useTokenBalance } from '@/hooks/useTokenBalance';

const tokens = [
  { symbol: 'USDT', address: process.env.VITE_USDT_CONTRACT_ADDRESS!, change: '+0.01%' },
  { symbol: 'USDC', address: process.env.VITE_USDC_CONTRACT_ADDRESS!, change: '-0.02%' },
];

interface TopTokensProps {
  className?: string;
}

export const TopTokens: React.FC<TopTokensProps> = ({ className = '' }) => {
  return (
    <Card className={`${className} p-6`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Tokens</h2>
      
      <div className="space-y-4">
        {tokens.map((token) => (
          <TokenRow key={token.symbol} {...token} />
        ))}
      </div>
    </Card>
  );
};

interface TokenRowProps {
  symbol: string;
  address: string;
  change: string;
}

const TokenRow: React.FC<TokenRowProps> = ({ symbol, address, change }) => {
  const { balance, isLoading } = useTokenBalance(address);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full" />
        <div>
          <h3 className="text-sm font-medium text-gray-900">{symbol}</h3>
          <p className="text-xs text-gray-500">
            {isLoading ? 'Loading...' : `Balance: ${balance}`}
          </p>
        </div>
      </div>
      <Badge
        variant={change.startsWith('+') ? 'success' : 'error'}
        size="sm"
      >
        {change}
      </Badge>
    </div>
  );
};