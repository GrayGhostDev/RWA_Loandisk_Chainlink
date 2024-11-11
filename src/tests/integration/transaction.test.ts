import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { createTestUser, getTestUserToken } from '../helpers/auth.js';

describe('Transaction API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    token = await getTestUserToken(user);
  });

  describe('POST /api/transactions', () => {
    it('creates a transaction successfully', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'DEPOSIT',
          amount: '100.00'
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        type: 'DEPOSIT',
        amount: '100.00',
        status: 'pending'
      });
    });

    it('validates transaction input', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'INVALID',
          amount: 'not-a-number'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/transactions', () => {
    it('returns user transactions', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('filters transactions by type', async () => {
      const response = await request(app)
        .get('/api/transactions?type=DEPOSIT')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.every((tx: any) => tx.type === 'DEPOSIT')).toBe(true);
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('returns transaction by id', async () => {
      // First create a transaction
      const createResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'DEPOSIT',
          amount: '100.00'
        });

      const id = createResponse.body.id;

      const response = await request(app)
        .get(`/api/transactions/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
    });

    it('returns 404 for non-existent transaction', async () => {
      const response = await request(app)
        .get('/api/transactions/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});