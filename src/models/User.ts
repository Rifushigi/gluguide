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
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{11,}$/
    },
    age: {
        type: Number,
        min: 0,
        max: 150
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    weight: {
        type: Number,
        min: 0
    },
    height: {
        type: Number,
        min: 0
    },
    bmi: {
        type: Number,
    },
    waistCircumference: {
        type: Number,
        min: 0
    },
    hipCircumference: {
        type: Number,
        min: 0
    },
    waistToHipRatio: {
        type: Number,
    },
    diabetesType: {
        type: String,
        enum: ['Type 1', 'Type 2', 'Gestational', 'Other']
    },
    modeOfTreatment: {
        type: String,
        enum: ['Insulin', 'Oral Medication', 'Diet Control', 'Combined']
    },
    lastFastingBloodSugar: {
        type: Number,
        min: 0
    },
    lastRandomBloodSugar: {
        type: Number,
        min: 0
    },
    lastHbA1cLevel: {
        type: Number,
        min: 0,
        max: 20
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number }
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