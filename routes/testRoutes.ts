import { Router } from 'express';
import { createTest, deleteTest, updateTest, getTest } from '../controllers/testController';
import { protect } from '../controllers/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createTest);
router.get('/:id', getTest);
router.patch('/:id', updateTest);
router.delete('/:id', deleteTest);

export default router;
