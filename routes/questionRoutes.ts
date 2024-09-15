import { Router } from 'express';
import {
  createQuestions,
  deleteQuestion,
  updateQuestion,
  getQuestion,
  updateQuestionChoiceForQuestion,
} from '../controllers/questionController';
import { protect } from '../controllers/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createQuestions);
router.get('/:id', getQuestion);
router.patch('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);
router.post('/questionChoice', updateQuestionChoiceForQuestion);

export default router;
