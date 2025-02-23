import { Router } from 'express';
import ActivityController from '../controllers/activity';
import { authMiddleware } from '../middlewares/auth'; // You'll need to implement this

const router = Router();

router.post('/activities', authMiddleware, ActivityController.create);
router.get('/activities', authMiddleware, ActivityController.getUserActivities);
router.get('/activities/latest', authMiddleware, ActivityController.getLatestActivity);
router.put('/activities/:id', authMiddleware, ActivityController.updateActivity);

export default router;
