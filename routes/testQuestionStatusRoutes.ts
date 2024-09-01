import { Router } from 'express';
import { createTestQuestionStatus, deleteTestQuestionStatus, updateTestQuestionStatus, getTestQuestionStatus, updateQuestionChoiceForTestQuestionStatus } from '../controller/testQuestionStatusController';
import { protect } from '../controller/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createTestQuestionStatus);
router.get('/:id', getTestQuestionStatus);
router.patch('/:id', updateTestQuestionStatus);
router.delete('/:id', deleteTestQuestionStatus);
router.post('/questionChoice', updateQuestionChoiceForTestQuestionStatus)

export default router;
