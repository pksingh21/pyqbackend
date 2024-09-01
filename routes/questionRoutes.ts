import { Router } from 'express';
import { createQuestion, deleteQuestion, updateQuestion, getQuestion } from '../controller/questionController';
import { protect } from '../controller/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createQuestion);
router.get('/:id', getQuestion);
router.patch('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
