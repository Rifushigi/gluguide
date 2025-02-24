import { Request, Response } from 'express';
import { DietaryAssessment } from '../models/Dietary';
import { FrequencyOption, IDietaryResponse, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, InternalServerError, BadRequestError } from '../types/errors';

class DietaryController {
    // Create dietary assessment
    static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const dietaryData: IDietaryResponse = req.body;
        const userId = req.user?.userId;

        // Validate userId
        if (dietaryData.userId !== userId) {
            throw new BadRequestError('User ID does not match the authenticated user');
        }

        const assessment = new DietaryAssessment({
            ...dietaryData,
            userId
        });

        const savedAssessment = await assessment.save();

        const response: ApiResponse = {
            status: 'success',
            message: 'Dietary assessment created successfully',
            data: savedAssessment
        };

        res.status(201).json(response);
    });

    // Get user assessments
    static getUserAssessments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        const assessments = await DietaryAssessment.find({ userId })
            .sort({ createdAt: -1 })
            .exec();

        if (!assessments || assessments.length === 0) {
            throw new NotFoundError('No dietary assessments found');
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'Dietary assessments retrieved successfully',
            data: assessments
        };

        res.status(200).json(response);
    });

    // Get latest assessment
    static getLatestAssessment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        const assessment = await DietaryAssessment.findOne({ userId })
            .sort({ createdAt: -1 })
            .exec();

        if (!assessment) {
            throw new NotFoundError('No dietary assessment found');
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'Latest dietary assessment retrieved successfully',
            data: assessment
        };

        res.status(200).json(response);
    });

    // Calculate dietary score
    static calculateDietaryScore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        const latestAssessment = await DietaryAssessment.findOne({ userId })
            .sort({ createdAt: -1 })
            .exec();

        if (!latestAssessment) {
            throw new NotFoundError('No dietary assessment found');
        }

        // Calculate dietary score based on healthy vs unhealthy choices
        let score = 0;
        const assessment = latestAssessment.toObject();

        // Higher scores for healthy choices
        if (assessment.fruitsVegetablesFrequency === FrequencyOption.MORE_THAN_4) score += 2;
        if (assessment.leanMeatFrequency === FrequencyOption.MORE_THAN_4) score += 2;
        if (assessment.wholeGrainsFrequency === FrequencyOption.MORE_THAN_4) score += 2;
        if (assessment.veganOptionsFrequency === FrequencyOption.MORE_THAN_4) score += 2;

        // Lower scores for unhealthy choices
        if (assessment.fastFoodFrequency === FrequencyOption.MORE_THAN_4) score -= 2;
        if (assessment.sodaFrequency === FrequencyOption.MORE_THAN_4) score -= 2;
        if (assessment.sugarDrinksFrequency === FrequencyOption.MORE_THAN_4) score -= 2;
        if (assessment.iceCreamFrequency === FrequencyOption.MORE_THAN_4) score -= 2;

        const response: ApiResponse = {
            status: 'success',
            message: 'Dietary score calculated successfully',
            data: {
                score,
                assessment: latestAssessment,
                recommendations: score < 0 ?
                    'Consider reducing intake of processed foods and increasing healthy options' :
                    'Good dietary choices! Keep maintaining a balanced diet'
            }
        };

        res.status(200).json(response);
    });
}

export default DietaryController;