import { Router } from 'express';
import {
  createQuestionChoice,
  deleteQuestionChoice,
  updateQuestionChoice,
  getQuestionChoice,
} from '../controllers/questionChoiceController';
import { protect } from '../controllers/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createQuestionChoice);
router.get('/:id', getQuestionChoice);
router.patch('/:id', updateQuestionChoice);
router.delete('/:id', deleteQuestionChoice);

export default router;
