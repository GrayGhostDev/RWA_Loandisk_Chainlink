import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

export const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'You have exceeded the request limit',
  },
});