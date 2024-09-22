import { Router } from 'express';
import {
  createPaperQuestion,
  deletePaperQuestion,
  updatePaperQuestion,
  getPaperQuestion,
} from '../controllers/paperQuestionsController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createPaperQuestion);
router.get('/:id', protectAuthLevel('user'), getPaperQuestion);
router.patch('/:id', protectAuthLevel('admin'), updatePaperQuestion);
router.delete('/:id', protectAuthLevel('admin'), deletePaperQuestion);

export default router;
