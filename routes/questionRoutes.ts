import { Router } from 'express';
import {
  createQuestions,
  deleteQuestion,
  deleteQuestionWithChoices,
  getQuestion,
  getQuestions,
  getQuestionsCount,
  updateQuestion,
  updateQuestionChoiceForQuestion,
} from '../controllers/questionController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createQuestions);
router.get('/count', protectAuthLevel('user'), getQuestionsCount);
router.get('/:id', protectAuthLevel('user'), getQuestion);
router.get('/', protectAuthLevel('user'), getQuestions);
router.patch('/:id', protectAuthLevel('admin'), updateQuestion);
router.delete('/:id', protectAuthLevel('admin'), deleteQuestion);
router.get('/withChoices/:id', protectAuthLevel('admin'), deleteQuestionWithChoices);
router.post('/questionChoice', protectAuthLevel('admin'), updateQuestionChoiceForQuestion);

export default router;
