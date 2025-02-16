import mongoose from 'mongoose';

const foodHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    foods: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        },
        quantity: Number,
        calories: Number
    }],
    totalCalories: Number,
    date: {
        type: Date,
        default: Date.now
    }
});