import { Router } from 'express';
import { createTest, deleteTest, updateTest, getTest } from '../controller/testController';
import { protect } from '../controller/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createTest);
router.get('/:id', getTest);
router.patch('/:id', updateTest);
router.delete('/:id', deleteTest);

export default router;
