import mongoose, { Schema, Document } from 'mongoose';
import { IActivityResponse } from '../types';

export interface IActivityDocument extends IActivityResponse, Document { }

const ActivitySchema: Schema = new Schema({
    vigorousActivityContinuous: { type: Boolean, required: true },
    vigorousActivityDaysPerWeek: { type: Number, required: true, min: 0, max: 7 },
    vigorousActivityDuration: { type: Number, required: true, min: 0 },
    moderateActivityContinuous: { type: Boolean, required: true },
    moderateActivityDaysPerWeek: { type: Number, required: true, min: 0, max: 7 },
    moderateActivityDuration: { type: Number, required: true, min: 0 },
    walkingOrBicyclingContinuous: { type: Boolean, required: true },
    walkingOrBicyclingDaysPerWeek: { type: Number, required: true, min: 0, max: 7 },
    walkingOrBicyclingDuration: { type: Number, required: true, min: 0 },
    doSports: { type: Boolean, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Activity = mongoose.model<IActivityDocument>('Activity', ActivitySchema);
