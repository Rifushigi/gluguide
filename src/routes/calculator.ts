import express from 'express';
import { calculateCalories } from '../controllers/calculatorController';

const router = express.Router();

router.post('/', calculateCalories);

export default router;