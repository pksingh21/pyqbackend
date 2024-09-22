import { Router } from 'express';
import { createTest, deleteTest, updateTest, getTest } from '../controllers/testController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createTest);
router.get('/:id', protectAuthLevel('user'), getTest);
router.patch('/:id', protectAuthLevel('admin'), updateTest);
router.delete('/:id', protectAuthLevel('admin'), deleteTest);

export default router;
