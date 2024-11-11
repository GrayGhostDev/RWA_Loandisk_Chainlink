import { Request, Response } from 'express';
import { TransactionService } from '../services/transactionService.js';
import { logger } from '../utils/logger.js';
import type { CreateTransactionDto } from '../types/transaction.js';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  create = async (req: Request<{}, {}, CreateTransactionDto>, res: Response) => {
    logger.debug('Creating transaction', { body: req.body });
    const transaction = await this.transactionService.create(req.userId!, req.body);
    res.status(201).json(transaction);
  };

  findAll = async (req: Request, res: Response) => {
    logger.debug('Fetching transactions', { userId: req.userId });
    const transactions = await this.transactionService.findByUserId(req.userId!);
    res.json(transactions);
  };

  findById = async (req: Request<{ id: string }>, res: Response) => {
    logger.debug('Fetching transaction by id', { 
      userId: req.userId,
      transactionId: req.params.id
    });
    const transaction = await this.transactionService.findById(
      req.userId!,
      req.params.id
    );
    res.json(transaction);
  };
}