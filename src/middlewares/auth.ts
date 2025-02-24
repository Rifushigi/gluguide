import { JWTError } from '../types/errors';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) throw new JWTError('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded) throw new JWTError('Invalid token');
    req.user = decoded;
    next();
});