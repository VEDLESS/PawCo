import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '@petco/shared';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);
router.put('/me', authMiddleware, validate(updateProfileSchema), UserController.updateProfile);
router.get('/:id', authMiddleware, UserController.getUserById);

export default router;
