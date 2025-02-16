import { Request, Response } from 'express';
import Food from "../models/Food";
import { NotFoundError, ValidationError } from '../types/errors';
import { asyncHandler } from '../utils/asyncHandler';

export const searchFood = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;
    const foods = await Food.find({
        name: { $regex: query, $options: 'i' }
    });
    if (!foods) throw new NotFoundError("Error searching foods");
    res.json(foods);
});

export const getFoodById = asyncHandler(async (req: Request, res: Response) => {
    const food = await Food.findById(req.params.id);
    if (!food) throw new NotFoundError('Food');
    res.json(food);
});

export const getAllFoods = asyncHandler(async (req: Request, res: Response) => {
    const foods = await Food.find();
    if (!foods) throw new NotFoundError('Error fetching foods');
    if (foods.length === 0) throw new NotFoundError('No foods found');
    res.json(foods);
});

export const addFood = asyncHandler(async (req: Request, res: Response) => {
    const { name, category, group, calories, caloriesPerServing, imageUrl } = req.body;

    if (!name || !category || !group || typeof calories !== 'number' || typeof caloriesPerServing !== 'number') {
        throw new ValidationError('Invalid food data', {
            name: 'Name is required',
            category: 'Category is required',
            group: 'Group is required',
            calories: 'Calories must be a number',
            caloriesPerServing: 'Calories per serving must be a number'
        });
    }

    const existingFood = await Food.findOne({ name });
    if (existingFood) {
        return res.status(400).json({ message: 'Food item already exists' });
    }

    const newFood = new Food({
        name,
        category,
        group,
        calories,
        caloriesPerServing,
        imageUrl
    });

    await newFood.save();

    res.status(201).json(newFood);
});