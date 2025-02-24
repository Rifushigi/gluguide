import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from '../config/email';
import { UserSignupInput, LoginInput, ApiResponse, IUser } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError, ConflictError, NotFoundError, UnauthorisedError } from '../types/errors';
import path from 'path';
import ejs from 'ejs';

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
        if (!user) throw new UnauthorisedError('Invalid credentials');

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new UnauthorisedError('Invalid credentials');

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

    // Request password reset
    static requestPasswordReset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) throw new NotFoundError('User');

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save reset token and expiration time to user document
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
        await user.save();


        // Send reset link to user's email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const templatePath = path.join(__dirname, "../views/emailTemplates/email.ejs");
        const htmlContent = await ejs.renderFile(templatePath, {
            title: "Password Reset Request",
            userName: user?.firstName || "User",
            resetLink: resetLink,
        })
        await sendEmail(user.email, 'Password Reset Request', htmlContent);

        const response: ApiResponse = {
            status: 'success',
            message: 'Password reset link sent to email',
            data: null
        };

        res.json(response);
    });

    // Reset password using token
    static resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { token, newPassword } = req.body;

        // Hash the token
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by reset token and check if token is not expired
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) throw new UnauthorisedError('Invalid or expired token');

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

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