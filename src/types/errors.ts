export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    public errors: Record<string, string>;

    constructor(message: string, errors: Record<string, string>) {
        super(message, 400);
        this.errors = errors;
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404);
    }
}

export class UnauthorisedError extends AppError {
    constructor(message: string = 'Unauthorised access') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 500);
    }
}

export class JWTError extends AppError {
    constructor(message: string = "Invalid token") {
        super(message, 401);
    }
}