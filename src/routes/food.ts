import express from 'express';
import { searchFood, getFoodById, getAllFoods, addFood } from '../controllers/foodController';
// import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/search', searchFood);
router.get('/:id', getFoodById);
router.get('/', getAllFoods);
router.post('/', addFood);

export default router;