import express from 'express';
import FoodController from '../controllers/food';

const router = express.Router();

router.get('/search', FoodController.searchFood);
router.get('/:id', FoodController.getFoodById);
router.get('/', FoodController.getAllFoods);
router.post('/', FoodController.addFood);
router.put('/:id', FoodController.updateFood);
router.delete('/:id', FoodController.deleteFood);

export default router;