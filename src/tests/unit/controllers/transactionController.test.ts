import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionController } from '../../../controllers/transactionController.js';
import { TransactionService } from '../../../services/transactionService.js';
import { mockRequest, mockResponse } from '../../helpers/express.js';

vi.mock('../../../services/transactionService.js');

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: jest.Mocked<TransactionService>;

  beforeEach(() => {
    service = new TransactionService() as jest.Mocked<TransactionService>;
    controller = new TransactionController();
    controller['transactionService'] = service;
  });

  describe('create', () => {
    it('creates transaction successfully', async () => {
      const mockTransaction = {
        id: '123',
        type: 'DEPOSIT',
        amount: '100',
        status: 'pending'
      };

      service.create.mockResolvedValueOnce(mockTransaction);

      const req = mockRequest({
        body: { type: 'DEPOSIT', amount: '100' },
        userId: 'user123'
      });
      const res = mockResponse();

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('findAll', () => {
    it('returns user transactions', async () => {
      const mockTransactions = [
        { id: '1', type: 'DEPOSIT', amount: '100' },
        { id: '2', type: 'WITHDRAWAL', amount: '50' }
      ];

      service.findByUserId.mockResolvedValueOnce(mockTransactions);

      const req = mockRequest({ userId: 'user123' });
      const res = mockResponse();

      await controller.findAll(req, res);

      expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });
  });

  describe('findById', () => {
    it('returns transaction by id', async () => {
      const mockTransaction = {
        id: '123',
        type: 'DEPOSIT',
        amount: '100'
      };

      service.findById.mockResolvedValueOnce(mockTransaction);

      const req = mockRequest({
        params: { id: '123' },
        userId: 'user123'
      });
      const res = mockResponse();

      await controller.findById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockTransaction);
    });
  });
});