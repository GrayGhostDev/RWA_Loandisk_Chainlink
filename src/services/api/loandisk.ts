import axios from 'axios';
import { API_BASE_URL } from '@/config/constants';
import type { Borrower, SavingsAccount, Transaction } from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBorrowerDetails = async (borrowerId: string): Promise<Borrower> => {
  const { data } = await api.get(`/borrower/${borrowerId}`);
  return data;
};

export const getSavingsAccounts = async (borrowerId: string): Promise<SavingsAccount[]> => {
  const { data } = await api.get(`/saving/borrower/${borrowerId}`);
  return data.Results;
};

export const getSavingsTransactions = async (
  savingsId: string,
  page = 1,
  count = 20
): Promise<Transaction[]> => {
  const { data } = await api.get(`/saving_transaction/saving/${savingsId}/from/${page}/count/${count}`);
  return data.Results;
};