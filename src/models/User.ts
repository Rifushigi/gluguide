import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types';

interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    // Authentication fields
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },

    // Medical/Patient fields
    initials: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{11,}$/
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 150
    },
    sex: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    height: {
        type: Number,
        required: true,
        min: 0
    },
    bmi: {
        type: Number,
    },
    waistCircumference: {
        type: Number,
        required: true,
        min: 0
    },
    hipCircumference: {
        type: Number,
        required: true,
        min: 0
    },
    waistToHipRatio: {
        type: Number,
    },
    diabetesType: {
        type: String,
        required: true,
        enum: ['Type 1', 'Type 2', 'Gestational', 'Other']
    },
    modeOfTreatment: {
        type: String,
        required: true,
        enum: ['Insulin', 'Oral Medication', 'Diet Control', 'Combined']
    },
    lastFastingBloodSugar: {
        type: Number,
        required: true,
        min: 0
    },
    lastRandomBloodSugar: {
        type: Number,
        required: true,
        min: 0
    },
    lastHbA1cLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    }
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
    const user = this as unknown as IUserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Calculate BMI and WHR
        const heightInMeters = user.height / 100;
        user.bmi = Number((user.weight / (heightInMeters * heightInMeters)).toFixed(2));
        user.waistToHipRatio = Number((user.waistCircumference / user.hipCircumference).toFixed(2));

        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);
export default User;