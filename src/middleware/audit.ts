import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

interface AuditLog {
  timestamp: string;
  userId?: string;
  action: string;
  resource: string;
  status: number;
  ip: string;
  userAgent: string;
  method: string;
  path: string;
  params: any;
  query: any;
  body: any;
}

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Capture the original end function
  const originalEnd = res.end;

  // Override the end function
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    const auditLog: AuditLog = {
      timestamp: new Date().toISOString(),
      userId: req.userId,
      action: req.method,
      resource: req.path,
      status: res.statusCode,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
    };

    // Log the audit entry
    logger.info('Audit log', {
      ...auditLog,
      duration,
      responseTime: `${duration}ms`
    });

    // Call the original end function
    originalEnd.call(res, chunk, encoding, cb);
  };

  next();
};