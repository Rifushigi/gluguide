import mongoose, { Document, Model } from 'mongoose';
import { IFood } from '../types';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: [String],
        required: true,
        enum: ['Rice', 'Swallow', 'Legumes','Fruits', 'Others']
    },
    group: {
        type: [String],
        required: true,
        enum: ['Carbohydrate', 'Protein', 'Fruits', 'Vegetables', 'Others']
    },
    calories: {
        type: Number,
        required: true
    },
    caloriesPerServing: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    }
);

type IFoodDocument = IFood & Document;

const Food: Model<IFoodDocument> = mongoose.model<IFoodDocument>('Food', foodSchema);

export default Food;
