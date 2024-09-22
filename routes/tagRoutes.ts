import { Router } from 'express';
import { createTag, deleteTag, updateTag, getTag } from '../controllers/tagController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createTag);
router.get('/:id', protectAuthLevel('user'), getTag);
router.patch('/:id', protectAuthLevel('admin'), updateTag);
router.delete('/:id', protectAuthLevel('admin'), deleteTag);

export default router;
