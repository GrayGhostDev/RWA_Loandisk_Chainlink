import React from 'react';
import { MarketOverview } from '@/components/market/MarketOverview';
import { TokenStats } from '@/components/market/TokenStats';
import { VolumeChart } from '@/components/market/VolumeChart';
import { useWallet } from '@/hooks/useWallet';
import { Alert } from '@/components/common/Alert';

const Market: React.FC = () => {
  const { address } = useWallet();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Market</h1>
        {!address && (
          <Alert type="info">
            Connect your wallet to start trading
          </Alert>
        )}
      </div>

      <MarketOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenStats
          tokenAddress={process.env.VITE_USDT_CONTRACT_ADDRESS!}
          priceFeedAddress={process.env.VITE_USDT_PRICE_FEED!}
          symbol="USDT"
        />
        <TokenStats
          tokenAddress={process.env.VITE_USDC_CONTRACT_ADDRESS!}
          priceFeedAddress={process.env.VITE_USDC_PRICE_FEED!}
          symbol="USDC"
        />
      </div>

      <VolumeChart />
    </div>
  );
};

export default Market;