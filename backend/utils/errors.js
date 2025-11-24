export class ApplicationError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message, details = null) {
    super(message, 400, details);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource, details = null) {
    super(`${resource} not found`, 404, details);
  }
}
