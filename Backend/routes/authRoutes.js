import express from 'express';
import { loginUser, getLoggedInUser, logoutUser, changePassword, resetPassword, getUserPermissions } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/login', loginUser);
router.get('/auth/me', protect, getLoggedInUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/change-password', protect, changePassword);
router.post('/auth/reset-password', resetPassword);
router.get('/auth/permissions', protect, getUserPermissions);

export default router;
