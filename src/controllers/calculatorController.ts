import { Request, Response } from 'express';
import { ICalculateCaloriesRequest } from '../types';
import Food from '../models/Food';
import { NotFoundError } from '../types/errors';
import { asyncHandler } from '../utils/asyncHandler';

export const calculateCalories = asyncHandler(async (req: Request, res: Response) => {
    const { items } = req.body as ICalculateCaloriesRequest;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid items array' });
    }

    let totalCalories = 0;

    for (const item of items) {
        if (!item.foodId || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return res.status(400).json({ message: 'Invalid item data' });
        }

        const food = await Food.findById(item.foodId);
        if (!food) {
            throw new NotFoundError('Food');
        }
        totalCalories += food.calories * item.quantity;
    }

    res.json({ totalCalories });
});
