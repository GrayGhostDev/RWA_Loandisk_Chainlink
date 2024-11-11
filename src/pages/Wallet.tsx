import React from 'react';
import { TokenBalances } from '@/components/wallet/TokenBalances';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { ConversionForm } from '@/components/conversion/ConversionForm';
import { useWallet } from '@/hooks/useWallet';
import { useConversion } from '@/hooks/useConversion';
import { Card } from '@/components/common/Card';

const Wallet: React.FC = () => {
  const { address } = useWallet();
  const { convert, isLoading } = useConversion();

  const handleConvert = async (amount: number, type: 'USDT' | 'USDC') => {
    if (!address) return;
    await convert(amount, type);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Wallet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TokenBalances />
        </div>
        <div>
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Convert</h2>
            <ConversionForm
              onConvert={handleConvert}
              maxAmount={1000}
            />
          </Card>
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
};

export default Wallet;