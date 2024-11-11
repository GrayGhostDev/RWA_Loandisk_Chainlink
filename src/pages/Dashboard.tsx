import React from 'react';
import { Card } from '@/components/common/Card';
import { TokenBalances } from '@/components/wallet/TokenBalances';
import { BorrowerDataFetcher } from '@/components/borrower/BorrowerDataFetcher';
import { CrossChainTransfer } from '@/components/ccip/CrossChainTransfer';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useAppStore } from '@/store';

const Dashboard: React.FC = () => {
  const { borrower, selectedAccount } = useAppStore();

  const handleBorrowerDataFetched = (data: any) => {
    console.log('Borrower data fetched:', data);
  };

  const handleTransferComplete = (result: any) => {
    console.log('Cross-chain transfer complete:', result);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <NotificationCenter />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Overview</h2>
          {borrower ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Name: <span className="font-medium text-gray-900">{borrower.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                ID: <span className="font-medium text-gray-900">{borrower.id}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No borrower information available</p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Balance</h2>
          {selectedAccount ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Account: <span className="font-medium text-gray-900">{selectedAccount.accountNumber}</span>
              </p>
              <p className="text-sm text-gray-600">
                Balance: <span className="font-medium text-gray-900">${selectedAccount.balance.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium text-gray-900">{selectedAccount.status}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No account selected</p>
          )}
        </Card>

        <TokenBalances />
        
        <BorrowerDataFetcher onDataFetched={handleBorrowerDataFetched} />

        {borrower && (
          <CrossChainTransfer
            borrowerId={borrower.id}
            loanData={selectedAccount}
            onTransferComplete={handleTransferComplete}
          />
        )}

        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;