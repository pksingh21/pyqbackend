import { Router } from 'express';
import {
  createQuestionChoice,
  deleteQuestionChoice,
  updateQuestionChoice,
  getQuestionChoice,
} from '../controllers/questionChoiceController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createQuestionChoice);
router.get('/:id', protectAuthLevel('user'), getQuestionChoice);
router.patch('/:id', protectAuthLevel('admin'), updateQuestionChoice);
router.delete('/:id', protectAuthLevel('admin'), deleteQuestionChoice);

export default router;
