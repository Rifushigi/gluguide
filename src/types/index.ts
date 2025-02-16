import { Document } from "mongoose";

export interface IFood {
    name: string;
    category: string[];
    group: string[];
    calories: number;
    caloriesPerServing: number;
    imageUrl?: string;
    _id?: string;
    $assertPopulated?: boolean;
    // $clearModifiedPaths?: () => void;
    // $clone?: () => IFood;
    // Add other optional properties as needed
}

// export interface IUserPreference {
//     userId: string;
//     measurementUnit: 'kg' | 'g' | 'lbs';
//     theme: 'light' | 'dark';
//     createdAt: Date;
//     updatedAt: Date;
// }

export interface ICalculateCaloriesRequest {
    items: Array<{
        foodId: string;
        quantity: number;
    }>;
}