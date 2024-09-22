import { Router } from 'express';
import { createPaper, deletePaper, updatePaper, getPaper, updateTagsForPaper } from '../controllers/paperController';
import { protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createPaper);
router.get('/:id', protectAuthLevel('admin'), getPaper);
router.patch('/:id', protectAuthLevel('admin'), updatePaper);
router.delete('/:id', protectAuthLevel('admin'), deletePaper);
router.post('/tags', protectAuthLevel('admin'), updateTagsForPaper);

export default router;
