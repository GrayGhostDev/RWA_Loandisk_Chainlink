import { describe, it, expect } from 'vitest';
import { getSystemHealth } from '../services/healthService.js';

describe('HealthService', () => {
  describe('getSystemHealth', () => {
    it('should return system health status', async () => {
      const health = await getSystemHealth();

      expect(health).toMatchObject({
        status: 'ok',
        environment: expect.any(String),
        uptime: expect.any(Number),
        memory: {
          used: expect.any(Number),
          total: expect.any(Number),
          percentage: expect.any(Number),
        },
      });

      expect(health.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it('should have valid memory values', async () => {
      const health = await getSystemHealth();

      expect(health.memory.used).toBeGreaterThan(0);
      expect(health.memory.total).toBeGreaterThan(0);
      expect(health.memory.percentage).toBeGreaterThan(0);
      expect(health.memory.percentage).toBeLessThanOrEqual(100);
    });
  });
});