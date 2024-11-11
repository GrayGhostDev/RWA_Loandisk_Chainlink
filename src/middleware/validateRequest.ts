import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';
import { EventLogger, AuditEventType } from '../services/audit/eventLogger.js';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Log validation failures
        if (req.userId) {
          await EventLogger.getInstance().logSecurityEvent(
            req.userId,
            'VALIDATION_FAILURE',
            {
              path: req.path,
              errors: error.errors,
              input: {
                body: req.body,
                query: req.query,
                params: req.params,
              },
            }
          );
        }

        next(new ValidationError('Invalid request data', error.errors));
      } else {
        next(error);
      }
    }
  };
};