import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from '../config.js';

// Rate limiting middleware
export const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  message: {
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.thirdweb.com", "https://ethereum.rpc.thirdweb.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
});

// Request signing middleware
export const verifySignature = async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-signature'];
  const timestamp = req.headers['x-timestamp'];
  const nonce = req.headers['x-nonce'];

  if (!signature || !timestamp || !nonce) {
    return res.status(401).json({
      error: 'Missing required headers',
      code: 'INVALID_SIGNATURE'
    });
  }

  // Verify timestamp is within acceptable range (5 minutes)
  const timestampMs = parseInt(timestamp as string);
  if (Date.now() - timestampMs > 300000) {
    return res.status(401).json({
      error: 'Request expired',
      code: 'REQUEST_EXPIRED'
    });
  }

  // TODO: Implement signature verification logic
  // This would verify the request signature using the user's public key

  next();
};