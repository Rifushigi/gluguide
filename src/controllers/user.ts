import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { UserSignupInput, LoginInput, ApiResponse, IUser } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../types/errors';

class UserController {
    // Register new user
    static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userInput: UserSignupInput = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Validate phone number
        if (!/^\d{11,}$/.test(userInput.phoneNumber)) {
            throw new BadRequestError('Invalid phone number format');
        }

        // Create new user
        const user = new User(userInput);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        const response: ApiResponse = {
            status: 'success',
            message: 'Registration successful',
            data: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        };

        res.status(201).json(response);
    });

    // Login user
    static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email, phoneNumber, password }: LoginInput = req.body;

        // Find user by email or phone number
        const user = await User.findOne({
            $or: [{ email: email }, { phoneNumber: phoneNumber }]
        });
        if (!user) throw new UnauthorizedError('Invalid credentials');

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new UnauthorizedError('Invalid credentials');

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        const response: ApiResponse = {
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        };

        res.json(response);
    });

    // Get current user
    static getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const user = await User.findById(req.user?.userId).select('-password');
        if (!user) throw new NotFoundError('User');

        const response: ApiResponse = {
            status: 'success',
            message: 'User retrieved successfully',
            data: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                age: user.age,
                sex: user.sex,
                weight: user.weight,
                height: user.height,
                waistCircumference: user.waistCircumference,
                hipCircumference: user.hipCircumference,
                diabetesType: user.diabetesType,
                modeOfTreatment: user.modeOfTreatment,
                lastFastingBloodSugar: user.lastFastingBloodSugar,
                lastRandomBloodSugar: user.lastRandomBloodSugar,
                lastHbA1cLevel: user.lastHbA1cLevel,
                bmi: user.bmi,
                waistToHipRatio: user.waistToHipRatio
            }
        };

        res.json(response);
    });

    // Update user
    static updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const updates: Partial<IUser> = req.body;

        // Calculate BMI and WHR if weight, height, waistCircumference, and hipCircumference are provided
        if (updates.weight && updates.height) {
            updates.bmi = updates.weight / ((updates.height / 100) ** 2);
        }
        if (updates.waistCircumference && updates.hipCircumference) {
            updates.waistToHipRatio = updates.waistCircumference / updates.hipCircumference;
        }

        const user = await User.findByIdAndUpdate(
            req.user?.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new NotFoundError('User');
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'User updated successfully',
            data: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                age: user.age,
                sex: user.sex,
                weight: user.weight,
                height: user.height,
                waistCircumference: user.waistCircumference,
                hipCircumference: user.hipCircumference,
                diabetesType: user.diabetesType,
                modeOfTreatment: user.modeOfTreatment,
                lastFastingBloodSugar: user.lastFastingBloodSugar,
                lastRandomBloodSugar: user.lastRandomBloodSugar,
                lastHbA1cLevel: user.lastHbA1cLevel,
                bmi: user.bmi,
                waistToHipRatio: user.waistToHipRatio
            }
        };

        res.json(response);
    });

    // Reset password
    static resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email, newPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) throw new NotFoundError('User not found');

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Save updated user
        await user.save();

        const response: ApiResponse = {
            status: 'success',
            message: 'Password reset successful',
            data: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };

        res.json(response);
    });
}

export default UserController;