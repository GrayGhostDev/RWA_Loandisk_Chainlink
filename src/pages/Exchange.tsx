import React from 'react';
import { Card } from '@/components/common/Card';
import { ConversionForm } from '@/components/conversion/ConversionForm';
import { useWallet } from '@/hooks/useWallet';
import { useConversion } from '@/hooks/useConversion';
import { useNotifications } from '@/hooks/useNotifications';

const Exchange: React.FC = () => {
  const { address } = useWallet();
  const { convert, isLoading } = useConversion();
  const { addNotification } = useNotifications();

  const handleConvert = async (amount: number, type: 'USDT' | 'USDC') => {
    if (!address) return;

    try {
      const result = await convert(amount, type);
      addNotification({
        type: 'success',
        title: 'Conversion Successful',
        message: `Successfully converted ${amount} to ${type}`,
      });
      return result;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Conversion Failed',
        message: error instanceof Error ? error.message : 'Failed to convert',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Exchange</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Convert</h2>
          <ConversionForm
            onConvert={handleConvert}
            maxAmount={1000} // This should come from your balance
          />
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Conversions</h2>
          {/* Add transaction history component here */}
        </Card>
      </div>
    </div>
  );
};

export default Exchange;