import express from 'express';
import { createUser, getUsers, updateUser, updateUserRole, lockUserAccount, unlockUserAccount } from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', protect, authorizeRoles('Admin'), getUsers);
router.put('/users/:id', protect, authorizeRoles('Admin'), updateUser);
router.put('/users/:id/role', protect, authorizeRoles('Admin'), updateUserRole);
router.put('/users/:id/lock', protect, authorizeRoles('Admin'), lockUserAccount);
router.put('/users/:id/unlock', protect, authorizeRoles('Admin'), unlockUserAccount);

export default router;
