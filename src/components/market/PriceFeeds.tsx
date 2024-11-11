import React from 'react';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';
import { Card } from '@/components/common/Card';

const PRICE_FEEDS = {
  'ETH/USD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  'USDT/USD': '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
  'USDC/USD': '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
};

export const PriceFeeds: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(PRICE_FEEDS).map(([pair, address]) => (
        <PriceFeedCard key={pair} pair={pair} address={address} />
      ))}
    </div>
  );
};

const PriceFeedCard: React.FC<{ pair: string; address: string }> = ({ 
  pair, 
  address 
}) => {
  const { price, isLoading, error } = useChainlinkPrice(address);

  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{pair}</h3>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading price...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : (
        <p className="text-2xl font-bold text-gray-900">
          ${Number(price).toFixed(2)}
        </p>
      )}
    </Card>
  );
};