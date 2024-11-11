import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  jwtSecret: z.string().min(1),
  jwtExpiresIn: z.string().default('1d'),
  rateLimitWindow: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  rateLimitMax: z.coerce.number().default(100),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW,
  rateLimitMax: process.env.RATE_LIMIT_MAX,
});