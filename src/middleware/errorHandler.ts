import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { EventLogger, AuditEventType } from '../services/audit/eventLogger.js';

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred', {
    error: err,
    path: req.path,
    method: req.method,
    userId: req.userId,
  });

  // Log security-related errors
  if (err instanceof AppError && err.statusCode === 401) {
    await EventLogger.getInstance().logSecurityEvent(
      req.userId || 'anonymous',
      'AUTHENTICATION_FAILURE',
      {
        path: req.path,
        method: req.method,
        error: err.message,
      }
    );
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      code: 'VALIDATION_ERROR',
      details: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      code: err.code,
      message: err.message,
    });
  }

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message;

  res.status(500).json({
    error: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
    message,
  });
};