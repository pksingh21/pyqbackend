import { Router } from 'express';
import { createQuestionChoice, deleteQuestionChoice, updateQuestionChoice, getQuestionChoice } from '../controller/questionChoiceController';
import { protect } from '../controller/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createQuestionChoice);
router.get('/:id', getQuestionChoice);
router.patch('/:id', updateQuestionChoice);
router.delete('/:id', deleteQuestionChoice);

export default router;
