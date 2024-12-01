import { Router } from 'express';
import { createTest, deleteTest, updateTest, getTest, getUserTestsForPaper } from '../controllers/testController';
import { protect, protectAuthLevel } from '../controllers/authController';

const router = Router();

router.post('/start', protectAuthLevel('user'), createTest);
router.get('/:id', protectAuthLevel('user'), getTest);
router.patch('/:id', protectAuthLevel('admin'), updateTest);
router.get('/paper/:paperId', protectAuthLevel('user'), getUserTestsForPaper);

router.delete('/:id', protectAuthLevel('admin'), deleteTest);

export default router;
