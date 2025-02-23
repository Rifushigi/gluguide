import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, UnauthorizedError } from '../types/errors';
import { logger } from '../config/logger';
import mongoose from 'mongoose';

interface ErrorResponse {
    status: string;
    message: string;
    errors?: Record<string, string>;
    stack?: string;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Error:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    let error = err;

    // Convert Mongoose errors to AppError
    if (err instanceof mongoose.Error.CastError) {
        error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    }

    if (err instanceof mongoose.Error.ValidationError) {
        const errors: Record<string, string> = {};
        Object.values(err.errors).forEach((err) => {
            errors[err.path] = err.message;
        });
        error = new ValidationError('Validation Error', errors);
    }

    const response: ErrorResponse = {
        status: error instanceof AppError ? error.status : 'error',
        message: error.message
    };

    if (error instanceof ValidationError) {
        response.errors = error.errors;
    }

    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
    }

    res.status(error instanceof AppError ? error.statusCode : 500).json(response);
};