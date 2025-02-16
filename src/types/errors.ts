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

// export class UnauthorizedError extends AppError {
//     constructor(message: string = 'Unauthorized access') {
//         super(message, 401);
//     }
// }