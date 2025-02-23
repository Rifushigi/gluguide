import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import foodRoutes from './routes/food';
import dietaryRoutes from './routes/dietary';
import activityRoutes from './routes/activity';
import userRoutes from './routes/user';
import { errorLogger } from './middlewares/errorLogger';
import { requestLogger } from './middlewares/requestLogger';
import { seedDatabase } from './config/seedDatabase';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api/foods', foodRoutes);
app.use('/api/dietary', dietaryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);

// Connect to database
connectDatabase();

// Seed database
seedDatabase();

app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});