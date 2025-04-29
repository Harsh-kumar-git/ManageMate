export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string>,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors?: Record<string, string>) {
    super(400, message, errors);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized to perform this action') {
    super(403, message);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class DuplicateError extends AppError {
  constructor(message: string) {
    super(409, message);
    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, message);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, undefined, false);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(503, message, undefined, false);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super(503, `${service} service is currently unavailable`);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}
