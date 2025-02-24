import Router from 'express';
import HomeController from '../controllers/app';

const router = Router();

router.get('/', HomeController.home);

export default router;