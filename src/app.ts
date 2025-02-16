import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import foodRoutes from './routes/food';
import calculatorRoutes from './routes/calculator';
import { errorLogger } from './middlewares/errorLogger'
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
app.use('/api/calculator', calculatorRoutes);

// Connect to database
connectDatabase();

// seed database
seedDatabase();

app.use(errorLogger);
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});