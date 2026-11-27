import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { sanitizePayload } from '../shared/utils/sanitize';

export function sanitizeBodyMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizePayload(req.body);
  }
  next();
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const sanitized = sanitizePayload(req.body ?? {});
      req.body = schema.parse(sanitized);
      next();
    } catch (error) {
      next(error);
    }
  };
}
