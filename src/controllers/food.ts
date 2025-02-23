import { Request, Response } from 'express';
import Food from "../models/Food";
import { NotFoundError, ValidationError, ConflictError } from '../types/errors';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../types';

class FoodController {
    // Search food
    static searchFood = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { query } = req.query;
        const foods = await Food.find({
            name: { $regex: query, $options: 'i' }
        });
        if (!foods) throw new NotFoundError("Error searching foods");

        const response: ApiResponse = {
            status: 'success',
            message: 'Foods retrieved successfully',
            data: foods
        };

        res.json(response);
    });

    // Get food by ID
    static getFoodById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const food = await Food.findById(req.params.id);
        if (!food) throw new NotFoundError('Food');

        const response: ApiResponse = {
            status: 'success',
            message: 'Food retrieved successfully',
            data: food
        };

        res.json(response);
    });

    // Get all foods
    static getAllFoods = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const foods = await Food.find();
        if (!foods) throw new NotFoundError('Error fetching foods');
        if (foods.length === 0) throw new NotFoundError('No foods found');

        const response: ApiResponse = {
            status: 'success',
            message: 'Foods retrieved successfully',
            data: foods
        };

        res.json(response);
    });

    // Add food
    static addFood = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
            throw new ConflictError('Food item already exists');
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

        const response: ApiResponse = {
            status: 'success',
            message: 'Food added successfully',
            data: newFood
        };

        res.status(201).json(response);
    });

    // Update food
    static updateFood = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const updateData = req.body;

        // Validate the request body
        if (updateData.calories !== undefined && typeof updateData.calories !== 'number') {
            throw new ValidationError('Invalid food data', {
                calories: 'Calories must be a number'
            });
        }
        if (updateData.caloriesPerServing !== undefined && typeof updateData.caloriesPerServing !== 'number') {
            throw new ValidationError('Invalid food data', {
                caloriesPerServing: 'Calories per serving must be a number'
            });
        }

        const food = await Food.findByIdAndUpdate(id, updateData, { new: true });
        if (!food) {
            throw new NotFoundError('Food not found');
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'Food updated successfully',
            data: food
        };

        res.json(response);
    });

    // Delete food
    static deleteFood = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        const food = await Food.findById(id);
        if (!food) {
            throw new NotFoundError('Food');
        }

        await Food.deleteOne({ _id: id });

        const response: ApiResponse = {
            status: 'success',
            message: 'Food item deleted successfully',
            data: null
        };

        res.status(200).json(response);
    });
}

export default FoodController;