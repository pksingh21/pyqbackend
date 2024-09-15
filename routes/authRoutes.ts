// authRoutes.ts
import { Router } from 'express';
import { login, getLoginStatus, logout, protect } from '../controllers/authController';

const router = Router();

// Public route
router.post('/login', login);

// Protected routes
router.use(protect);
router.get('/login-status', getLoginStatus);
router.post('/logout', logout);

export default router;
