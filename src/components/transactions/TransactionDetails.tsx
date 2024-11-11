import React from 'react';
import { TransactionDetails as ITransactionDetails } from '@/types/transaction';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

interface TransactionDetailsProps {
  details: ITransactionDetails;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  details
}) => {
  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
        <Badge variant="primary">
          {details.type}
        </Badge>
      </div>

      <dl className="grid grid-cols-1 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Amount</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">
            ${details.amount}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">Fee</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">
            ${details.fee}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">Net Amount</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">
            ${details.netAmount}
          </dd>
        </div>

        {details.recipient && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Recipient</dt>
            <dd className="mt-1 text-sm text-gray-900 break-all">
              {details.recipient}
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
};