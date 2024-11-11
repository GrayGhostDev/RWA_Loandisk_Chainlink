export interface Borrower {
  id: string;
  name: string;
}

export interface SavingsAccount {
  accountNumber: string;
  balance: number;
  status: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string;
}