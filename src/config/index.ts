import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  
  database: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(5432),
    name: z.string(),
    user: z.string(),
    password: z.string(),
    ssl: z.boolean().default(false),
  }),

  redis: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(6379),
    password: z.string().optional(),
    tls: z.boolean().default(false),
  }),

  jwt: z.object({
    secret: z.string().min(1),
    expiresIn: z.string().default('1d'),
  }),

  rateLimit: z.object({
    windowMs: z.coerce.number().default(15 * 60 * 1000),
    max: z.coerce.number().default(100),
  }),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW,
    max: process.env.RATE_LIMIT_MAX,
  },
});