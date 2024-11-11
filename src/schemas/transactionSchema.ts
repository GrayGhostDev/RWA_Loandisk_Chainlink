import { z } from 'zod';
import { TransactionType } from '../types/transaction.js';

export const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'CONVERSION'] as const),
    amount: z.string().regex(/^\d+(\.\d{1,6})?$/, 'Invalid amount format'),
  }),
});

export const transactionResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'CONVERSION'] as const),
  amount: z.string(),
  fee: z.string(),
  status: z.enum(['pending', 'completed', 'failed'] as const),
  timestamp: z.number(),
  hash: z.string().optional(),
});