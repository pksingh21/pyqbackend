// authRoutes.ts
import { Router } from 'express';
import { createUser, deleteUser, updateUser, getUser } from '../controller/userController';
import { protect }  from '../controller/authController'
const router = Router();

// Public route
router.post('/', createUser);

// Protected routes
router.use(protect);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;