import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getBorrowerDetails = async (borrowerId: string) => {
  const response = await api.get(`/api/borrowers/${borrowerId}`);
  return response.data;
};

export const getSavingsAccounts = async (borrowerId: string) => {
  const response = await api.get(`/api/savings/${borrowerId}`);
  return response.data;
};

export const getTransactions = async (accountId: string) => {
  const response = await api.get(`/api/transactions/${accountId}`);
  return response.data;
};

export default api;