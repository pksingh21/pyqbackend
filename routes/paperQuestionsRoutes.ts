import { Router } from 'express';
import {
  createPaperQuestion,
  deletePaperQuestion,
  updatePaperQuestion,
  getPaperQuestion,
} from '../controller/paperQuestionsController';
import { protect } from '../controller/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createPaperQuestion);
router.get('/:id', getPaperQuestion);
router.patch('/:id', updatePaperQuestion);
router.delete('/:id', deletePaperQuestion);

export default router;
