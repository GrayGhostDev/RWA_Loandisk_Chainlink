import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/cache/redis';

export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl}`;
    const cacheService = CacheService.getInstance();

    try {
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original send function
      const originalSend = res.json;

      // Override send function
      res.json = function(body: any): Response {
        // Restore original send
        res.json = originalSend;

        // Cache the response
        cacheService.set(cacheKey, body, ttlSeconds);

        // Send the response
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      // If cache fails, continue without caching
      next();
    }
  };
};