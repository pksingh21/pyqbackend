import { Router } from 'express';
import { createTest, deleteTest, updateTest, getTest, getUserTestsForPaper } from '../controllers/testController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/', protectAuthLevel('admin'), createTest);
router.get('/:id', protectAuthLevel('user'), getTest);
router.patch('/:id', protectAuthLevel('admin'), updateTest);
router.get(
    '/paper/:paperId/user-tests',
    protectAuthLevel('user'),
    getUserTestsForPaper
  );

router.delete('/:id', protectAuthLevel('admin'), deleteTest);

export default router;
