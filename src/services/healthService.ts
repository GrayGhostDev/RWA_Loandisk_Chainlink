import { config } from '../config.js';
import { logger } from '../utils/logger.js';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  environment: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export async function getSystemHealth(): Promise<HealthStatus> {
  try {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    logger.debug('System health check', {
      memory: { used: usedMemory, total: totalMemory }
    });

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      uptime: process.uptime(),
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage * 100) / 100,
      },
    };
  } catch (error) {
    logger.error('Health check failed', { error });
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      uptime: process.uptime(),
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
    };
  }
}