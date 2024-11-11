import React, { useState } from 'react';
import { useCCIP } from '@/hooks/useCCIP';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';

interface CrossChainTransferProps {
  borrowerId: string;
  loanData: any;
  onTransferComplete?: (result: any) => void;
}

export const CrossChainTransfer: React.FC<CrossChainTransferProps> = ({
  borrowerId,
  loanData,
  onTransferComplete
}) => {
  const { sendCrossChainData, checkMessageStatus, isLoading } = useCCIP();
  const [selectedChain, setSelectedChain] = useState('polygon');
  const [messageId, setMessageId] = useState<string | null>(null);
  const [messageStatus, setMessageStatus] = useState<string | null>(null);

  const handleTransfer = async () => {
    try {
      const result = await sendCrossChainData(
        selectedChain,
        {
          borrowerId,
          loanData,
          timestamp: Date.now()
        }
      );

      setMessageId(result.messageId);
      onTransferComplete?.(result);

      // Start polling for message status
      pollMessageStatus(result.messageId);
    } catch (error) {
      console.error('Error in cross-chain transfer:', error);
    }
  };

  const pollMessageStatus = async (id: string) => {
    try {
      const status = await checkMessageStatus(id);
      setMessageStatus(status);

      if (status !== 'completed' && status !== 'failed') {
        setTimeout(() => pollMessageStatus(id), 5000); // Poll every 5 seconds
      }
    } catch (error) {
      console.error('Error checking message status:', error);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Cross-Chain Transfer</h2>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="chain" 
            className="block text-sm font-medium text-gray-700"
          >
            Destination Chain
          </label>
          <select
            id="chain"
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isLoading}
          >
            <option value="polygon">Polygon</option>
            <option value="optimism">Optimism</option>
            <option value="arbitrum">Arbitrum</option>
          </select>
        </div>

        {messageId && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Message ID:</span>
            <Badge
              variant={
                messageStatus === 'completed' ? 'success' :
                messageStatus === 'failed' ? 'error' :
                'primary'
              }
            >
              {messageStatus || 'Pending'}
            </Badge>
          </div>
        )}

        <Button
          onClick={handleTransfer}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </span>
          ) : (
            'Send Cross-Chain'
          )}
        </Button>
      </div>
    </Card>
  );
};