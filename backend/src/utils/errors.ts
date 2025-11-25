export class ApplicationError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  constructor(message: string, status = 500, details: unknown = null) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details: unknown = null) {
    super(message, 400, details);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, details: unknown = null) {
    super(`${resource} not found`, 404, details);
  }
}
