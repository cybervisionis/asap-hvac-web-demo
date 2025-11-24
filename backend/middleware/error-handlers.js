import { ApplicationError, NotFoundError, ValidationError } from '../utils/errors.js';

export function notFoundHandler(req, res, next) {
  next(new NotFoundError('Route', { method: req.method, path: req.originalUrl }));
}

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const error = err instanceof ApplicationError
    ? err
    : new ApplicationError(err.message ?? 'Unexpected server error');

  const payload = {
    error: error.name,
    message: error.message
  };

  if (error instanceof ValidationError && error.details) {
    payload.details = error.details;
  }

  if (error.details && !(error instanceof ValidationError)) {
    payload.details = error.details;
  }

  res.status(error.status ?? 500).json(payload);
}
