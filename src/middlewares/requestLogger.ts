import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // Capture response time
    const start = Date.now();

    // Process the request
    res.on('finish', () => {
        const duration = Date.now() - start;

        const logMessage = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent') || '',
            ip: req.ip,
            query: req.query,
            body: req.method !== 'GET' ? req.body : undefined,
            userId: (req as any).user?.id || 'anonymous'
        };

        // Log based on status code
        if (res.statusCode >= 500) {
            logger.error(`Error: ${JSON.stringify(logMessage)}`);
        } else if (res.statusCode >= 400) {
            logger.warn(`Warning: ${JSON.stringify(logMessage)}`);
        } else {
            logger.http(`Request: ${JSON.stringify(logMessage)}`);
        }
    });

    next();
};