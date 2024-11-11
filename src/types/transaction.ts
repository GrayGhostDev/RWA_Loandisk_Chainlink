export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'CONVERSION';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  fee: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  hash?: string;
}

export interface TransactionDetails {
  amount: string;
  fee: string;
  netAmount: string;
  type: TransactionType;
  recipient?: string;
}