import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createTransactionSchema } from '../schemas/transactionSchema.js';
import { auth } from '../middleware/auth.js';

const transactionController = new TransactionController();
export const transactionRouter = Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [DEPOSIT, WITHDRAWAL, CONVERSION]
 *               amount:
 *                 type: string
 *                 description: Amount in base units
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
transactionRouter.post(
  '/',
  auth,
  validateRequest(createTransactionSchema),
  transactionController.create
);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get user transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [DEPOSIT, WITHDRAWAL, CONVERSION]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed]
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
transactionRouter.get('/', auth, transactionController.findAll);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
transactionRouter.get('/:id', auth, transactionController.findById);