import { Request, Response, NextFunction } from 'express';
import { ApplicationError, NotFoundError, ValidationError } from '../utils/errors.js';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  next(new NotFoundError('Route', { method: req.method, path: req.originalUrl }));
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void { // eslint-disable-line @typescript-eslint/no-unused-vars
  const error = err instanceof ApplicationError
    ? err
    : new ApplicationError(err instanceof Error ? err.message : 'Unexpected server error');

  const payload: Record<string, unknown> = {
    error: error.name,
    message: error.message
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (error instanceof ValidationError && error.details) {
    payload.details = error.details;
  }

  res.status(error.status ?? 500).json(payload);
}
