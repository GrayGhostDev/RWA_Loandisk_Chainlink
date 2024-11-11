import { Router } from 'express';
import { HealthController } from '../controllers/healthController.js';

const healthController = new HealthController();
export const healthRouter = Router();

healthRouter.get('/', healthController.check);