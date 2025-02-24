import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import foodRoutes from './routes/food';
import dietaryRoutes from './routes/dietary';
import activityRoutes from './routes/activity';
import userRoutes from './routes/user';
import { errorLogger } from './middlewares/errorLogger';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import HomeController from './controllers/app';

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
app.use('/', HomeController.home)

// Connect to database
connectDatabase();

// Handle unmatched routes
app.use(notFoundHandler);


app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});