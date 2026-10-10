import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { OfferService } from '../services/offer.service';

export class OfferController {
  static async createOffer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const offer = await OfferService.createOffer(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Offer submitted to pet parent',
        data: offer,
      });
    } catch (error) {
      next(error);
    }
  }

  static async acceptOffer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await OfferService.acceptOffer(req.user!.userId, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Offer accepted and booking confirmed!',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}
