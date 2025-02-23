import express from 'express';
import UserController from '../controllers/user';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', authMiddleware, UserController.getCurrentUser);
router.put('/update', authMiddleware, UserController.updateUser);
router.post('/reset-password', UserController.resetPassword);

export default router;