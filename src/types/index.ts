import { ObjectId } from "mongoose";
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
}

export interface IUserPreference {
    userId: string;
    measurementUnit: 'kg' | 'g' | 'lbs';
    theme: 'light' | 'dark';
    createdAt: Date;
    updatedAt: Date;
}

export interface ICalculateCaloriesRequest {
    items: Array<{
        foodId: string;
        quantity: number;
    }>;
}

export interface IUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    initials: string;
    phoneNumber: string;
    age: number;
    sex: 'Male' | 'Female' | 'Other';
    weight: number;
    height: number;
    bmi: number;
    waistCircumference: number;
    hipCircumference: number;
    waistToHipRatio: number;
    diabetesType: 'Type 1' | 'Type 2' | 'Gestational' | 'Other';
    modeOfTreatment: 'Insulin' | 'Oral Medication' | 'Diet Control' | 'Combined';
    lastFastingBloodSugar: number;
    lastRandomBloodSugar: number;
    lastHbA1cLevel: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSignupInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface LoginInput {
    email?: string;
    phoneNumber?: string;
    password: string;
}

export interface ApiResponse {
    status: 'success' | 'error';
    message: string;
    data?: any;
}

export interface IDietaryResponse {
    fastFoodFrequency: FrequencyOption;
    sodaFrequency: FrequencyOption;
    fruitsVegetablesFrequency: FrequencyOption;
    sugarDrinksFrequency: FrequencyOption;
    leanMeatFrequency: FrequencyOption;
    wholeGrainsFrequency: FrequencyOption;
    iceCreamFrequency: FrequencyOption;
    veganOptionsFrequency: FrequencyOption;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum FrequencyOption {
    LESS_THAN_2 = "Less than 2 times",
    TWO_TIMES = "2 times",
    MORE_THAN_4 = "More than 4 times"
}

export interface IActivityResponse {
    vigorousActivityContinuous: boolean;
    vigorousActivityDaysPerWeek: number;
    vigorousActivityDuration: number;
    moderateActivityContinuous: boolean;
    moderateActivityDaysPerWeek: number;
    moderateActivityDuration: number;
    walkingOrBicyclingContinuous: boolean;
    walkingOrBicyclingDaysPerWeek: number;
    walkingOrBicyclingDuration: number;
    doSports: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}