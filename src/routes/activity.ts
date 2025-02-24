import { Router } from 'express';
import ActivityController from '../controllers/activity';
import { authMiddleware } from '../middlewares/auth'; // You'll need to implement this

const router = Router();

router.post('/', authMiddleware, ActivityController.create);
router.get('/', authMiddleware, ActivityController.getUserActivities);
router.get('/latest', authMiddleware, ActivityController.getLatestActivity);
router.put('/:id', authMiddleware, ActivityController.updateActivity);

export default router;
