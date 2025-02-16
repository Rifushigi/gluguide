import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error Stack:', error.stack);
    logger.error('Error Details:', {
        name: error.name,
        message: error.message,
        url: req.url,
        method: req.method,
        body: req.body
    });

    next(error);
};