import { Request, Response } from 'express';
import { getSystemHealth } from '../services/healthService.js';
import { logger } from '../utils/logger.js';

export class HealthController {
  async check(req: Request, res: Response) {
    logger.debug('Health check requested');
    const health = await getSystemHealth();
    res.json(health);
  }
}