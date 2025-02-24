import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { IActivityResponse, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, InternalServerError } from '../types/errors';

class ActivityController {
    // Create activity
    static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const activityData: IActivityResponse = req.body;
        const userId = req.user?.userId; // Assuming you have authentication middleware

        const activity = new Activity({
            ...activityData,
            userId
        });

        const savedActivity = await activity.save();

        const response: ApiResponse = {
            status: 'success',
            message: 'Activity record created successfully',
            data: savedActivity
        };

        res.status(201).json(response);
    });

    // Get user activities
    static getUserActivities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        const activities = await Activity.find({ userId })
            .sort({ createdAt: -1 })
            .exec();

        if (!activities || activities.length === 0) {
            throw new NotFoundError('Activity records');
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'Activity records retrieved successfully',
            data: activities
        };

        res.status(200).json(response);
    });

    // Get latest activity
    static getLatestActivity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        const activity = await Activity.findOne({ userId })
            .sort({ createdAt: -1 })
            .exec();

        if (!activity) {
            throw new NotFoundError('No activity record found');
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'Latest activity record retrieved successfully',
            data: activity
        };

        res.status(200).json(response);
    });

    // Update activity
    static updateActivity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const activityId = req.params.id;
        const userId = req.user?.userId;

        const activity = await Activity.findOne({ _id: activityId, userId });

        if (!activity) {
            throw new NotFoundError('Activity record not found');
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedActivity) {
            throw new InternalServerError('Failed to update activity record');
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'Activity record updated successfully',
            data: updatedActivity
        };

        res.status(200).json(response);
    });
}

export default ActivityController;
