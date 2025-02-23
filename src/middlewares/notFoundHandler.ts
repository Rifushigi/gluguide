import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../types/errors';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError('Route not found');
    next(error);
};