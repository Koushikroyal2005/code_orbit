import express from 'express';
import {
  loginUser,
  getUser,
  updateBookmarks,
  updateSolved,
  updateFriends,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/me', protect, getUser);
router.put('/bookmarks', protect, updateBookmarks);
router.put('/solved', protect, updateSolved);
router.put('/friends', protect, updateFriends);

export default router;