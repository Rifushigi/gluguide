import mongoose, { Schema, Document } from 'mongoose';
import { IDietaryResponse, FrequencyOption } from '../types';

export interface IDietaryDocument extends IDietaryResponse, Document { }

const DietarySchema: Schema = new Schema({
    fastFoodFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    sodaFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    fruitsVegetablesFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    sugarDrinksFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    leanMeatFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    wholeGrainsFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    iceCreamFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    veganOptionsFrequency: {
        type: String,
        enum: Object.values(FrequencyOption),
        required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const DietaryAssessment = mongoose.model<IDietaryDocument>('DietaryAssessment', DietarySchema);