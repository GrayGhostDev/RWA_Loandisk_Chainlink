import React, { useState } from 'react';
import { useChainlinkFunctions } from '@/hooks/useChainlinkFunctions';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface BorrowerDataFetcherProps {
  onDataFetched?: (data: any) => void;
}

export const BorrowerDataFetcher: React.FC<BorrowerDataFetcherProps> = ({
  onDataFetched
}) => {
  const [borrowerId, setBorrowerId] = useState('');
  const { fetchBorrowerData, isLoading, error } = useChainlinkFunctions();

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerId || isLoading) return;

    try {
      const result = await fetchBorrowerData(borrowerId);
      onDataFetched?.(result);
      setBorrowerId('');
    } catch (error) {
      console.error('Error fetching borrower data:', error);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Fetch Borrower Data</h2>
      
      <form onSubmit={handleFetch} className="space-y-4">
        <div>
          <label 
            htmlFor="borrowerId" 
            className="block text-sm font-medium text-gray-700"
          >
            Borrower ID
          </label>
          <input
            type="text"
            id="borrowerId"
            value={borrowerId}
            onChange={(e) => setBorrowerId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter borrower ID"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={!borrowerId || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Fetching...
            </span>
          ) : (
            'Fetch Data'
          )}
        </Button>
      </form>
    </Card>
  );
};