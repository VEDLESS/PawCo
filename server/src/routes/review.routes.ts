import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { reviewSchema } from '@petco/shared';

const router = Router();

router.post('/', authMiddleware, validate(reviewSchema), ReviewController.createReview);
router.get('/user/:userId', authMiddleware, ReviewController.getReviewsByUser);

export default router;
