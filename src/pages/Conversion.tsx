import React from 'react';
import { Card } from '@/components/common/Card';
import { ConversionForm } from '@/components/conversion/ConversionForm';
import { useWallet } from '@/hooks/useWallet';
import { useConversion } from '@/hooks/useConversion';
import { useAppStore } from '@/store';

const Conversion: React.FC = () => {
  const { address } = useWallet();
  const { convert } = useConversion();
  const { selectedAccount } = useAppStore();

  const handleConvert = async (amount: number, type: 'USDT' | 'USDC') => {
    if (!address || !selectedAccount) return;
    
    try {
      const txHash = await convert(amount, type);
      console.log('Conversion successful:', txHash);
    } catch (error) {
      console.error('Conversion failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Conversion</h1>
      
      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Convert USD to USDT/USDC</h2>
        {address && selectedAccount ? (
          <ConversionForm
            onConvert={handleConvert}
            maxAmount={selectedAccount.balance}
          />
        ) : (
          <p className="text-sm text-gray-500">
            {!address 
              ? 'Please connect your wallet to start conversion'
              : 'Please select an account to start conversion'
            }
          </p>
        )}
      </Card>
    </div>
  );
};

export default Conversion;