import mongoose from 'mongoose';
import { seedDatabase } from './seedDatabase';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');
        seedDatabase();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};