import { Router } from 'express';
import {
  createTestQuestionStatus,
  deleteTestQuestionStatus,
  updateTestQuestionStatus,
  getTestQuestionStatus,
  updateQuestionChoiceForTestQuestionStatus,
} from '../controllers/testQuestionStatusController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createTestQuestionStatus);
router.get('/:id', protectAuthLevel('user'), getTestQuestionStatus);
router.patch('/:id', protectAuthLevel('admin'), updateTestQuestionStatus);
router.delete('/:id', protectAuthLevel('admin'), deleteTestQuestionStatus);
router.post('/questionChoice', protectAuthLevel('admin'), updateQuestionChoiceForTestQuestionStatus);

export default router;
