import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ReviewService } from '../services/review.service';

export class ReviewController {
  static async createReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.createReview(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReviewsByUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.getReviewsByUserId(req.params.userId);
      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }
}
