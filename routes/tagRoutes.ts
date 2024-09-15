import { Router } from 'express';
import { createTag, deleteTag, updateTag, getTag } from '../controllers/tagController';
import { protect } from '../controllers/authController';

const router = Router();

// Public route

// Protected routes
router.use(protect);

router.post('/', createTag);
router.get('/:id', getTag);
router.patch('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
