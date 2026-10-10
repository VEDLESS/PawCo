import { Router } from 'express';
import { OfferController } from '../controllers/offer.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createOfferSchema, Role } from '@petco/shared';

const router = Router();

router.post('/', authMiddleware, requireRole(Role.HELPER), validate(createOfferSchema), OfferController.createOffer);
router.post('/:id/accept', authMiddleware, OfferController.acceptOffer);

export default router;
