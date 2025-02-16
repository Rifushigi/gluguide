import express from 'express';
import { searchFood, getFoodById, getAllFoods, addFood, updateFood, deleteFood } from '../controllers/foodController';
// import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/search', searchFood);
router.get('/:id', getFoodById);
router.get('/', getAllFoods);
router.post('/', addFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;