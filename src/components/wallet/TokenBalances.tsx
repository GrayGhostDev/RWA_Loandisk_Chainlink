import React from 'react';
import { useUSDTBalance, useUSDCBalance } from '@/hooks/useTokenBalance';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';
import { Card } from '@/components/common/Card';

export const TokenBalances: React.FC = () => {
  const { balance: usdtBalance, isLoading: isLoadingUSDT } = useUSDTBalance();
  const { balance: usdcBalance, isLoading: isLoadingUSDC } = useUSDCBalance();
  const { price: usdtPrice } = useChainlinkPrice(process.env.VITE_USDT_PRICE_FEED!);
  const { price: usdcPrice } = useChainlinkPrice(process.env.VITE_USDC_PRICE_FEED!);

  const calculateValue = (balance: string, price: string | null) => {
    if (!balance || !price) return '0.00';
    return (Number(balance) * Number(price)).toFixed(2);
  };

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Token Balances</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-900">USDT</h3>
            <p className="text-xs text-gray-500">
              Value: ${calculateValue(usdtBalance, usdtPrice)}
            </p>
          </div>
          <span className="text-lg font-medium">
            {isLoadingUSDT ? 'Loading...' : `${usdtBalance} USDT`}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-900">USDC</h3>
            <p className="text-xs text-gray-500">
              Value: ${calculateValue(usdcBalance, usdcPrice)}
            </p>
          </div>
          <span className="text-lg font-medium">
            {isLoadingUSDC ? 'Loading...' : `${usdcBalance} USDC`}
          </span>
        </div>
      </div>
    </Card>
  );
};