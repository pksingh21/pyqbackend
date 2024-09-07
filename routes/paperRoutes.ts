import { Router } from 'express';
import { createPaper, deletePaper, updatePaper, getPaper, updateTagsForPaper } from '../controller/paperController';
import { protect } from '../controller/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createPaper);
router.get('/:id', getPaper);
router.patch('/:id', updatePaper);
router.delete('/:id', deletePaper);
router.post('/tags', updateTagsForPaper);

export default router;
