import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../shared/exceptions/ApiError';
import { env } from '../config/environment';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación en los datos enviados',
      details: err.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const message =
    env.nodeEnv === 'production'
      ? 'Error interno del servidor'
      : err instanceof Error
        ? err.message
        : 'Error interno inesperado';

  console.error('[ErrorMiddleware]', err);

  return res.status(500).json({
    success: false,
    message,
  });
}
