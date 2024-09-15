import { Router } from 'express';
import {
  createPaperQuestion,
  deletePaperQuestion,
  updatePaperQuestion,
  getPaperQuestion,
} from '../controllers/paperQuestionsController';
import { protect } from '../controllers/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createPaperQuestion);
router.get('/:id', getPaperQuestion);
router.patch('/:id', updatePaperQuestion);
router.delete('/:id', deletePaperQuestion);

export default router;
