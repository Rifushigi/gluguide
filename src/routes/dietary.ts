import { Router } from 'express';
import DietaryController from '../controllers/dietary';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/dietary-assessments', authMiddleware, DietaryController.create);
router.get('/dietary-assessments', authMiddleware, DietaryController.getUserAssessments);
router.get('/dietary-assessments/latest', authMiddleware, DietaryController.getLatestAssessment);
router.get('/dietary-assessments/score', authMiddleware, DietaryController.calculateDietaryScore);

export default router;
