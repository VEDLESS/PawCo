import { Router } from 'express';
import { HelperController } from '../controllers/helper.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { helperProfileSchema, nearbyHelperQuerySchema, Role } from '@petco/shared';

const router = Router();

router.put('/profile', authMiddleware, requireRole(Role.HELPER), validate(helperProfileSchema.partial()), HelperController.updateMyProfile);
router.get('/nearby', validate(nearbyHelperQuerySchema, 'query'), HelperController.getNearbyHelpers);
router.get('/search', HelperController.searchHelpers);
router.get('/:userId', HelperController.getProfileByUserId);

export default router;
