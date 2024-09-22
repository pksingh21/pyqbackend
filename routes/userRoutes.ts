// authRoutes.ts
import { Router } from 'express';
import { createUser, deleteUser, updateUser, getUser } from '../controllers/userController';
import { protect, protectAuthLevel } from '../controllers/authController';
const router = Router();

// Public route
router.post('/', createUser);

router.get('/:id', protectAuthLevel('user'), getUser);
router.patch('/:id', protectAuthLevel('user'), updateUser);
router.delete('/:id', protectAuthLevel('user'), deleteUser);

export default router;
