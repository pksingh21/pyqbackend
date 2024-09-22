// authRoutes.ts
import { Router } from 'express';
import { login, getLoginStatus, logout, protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

// Public route
router.post('/login', login);

router.get('/login-status', protectAuthLevel('user'), getLoginStatus);
router.post('/logout', protectAuthLevel('user'), logout);

export default router;
