import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { HelperService } from '../services/helper.service';

export class HelperController {
  static async updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await HelperService.upsertHelperProfile(req.user!.userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Helper profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfileByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await HelperService.getHelperProfileByUserId(req.params.userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNearbyHelpers(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude, radiusKm, serviceType } = req.query as any;
      const helpers = await HelperService.getNearbyHelpers({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radiusKm: radiusKm ? parseFloat(radiusKm) : undefined,
        serviceType: serviceType as any,
      });
      res.status(200).json({
        success: true,
        data: helpers,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchHelpers(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceType, maxRate, minRating, searchTerm } = req.query as any;
      const helpers = await HelperService.searchHelpers({
        serviceType: serviceType as any,
        maxRate: maxRate ? parseFloat(maxRate) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        searchTerm: searchTerm as string,
      });
      res.status(200).json({
        success: true,
        data: helpers,
      });
    } catch (error) {
      next(error);
    }
  }
}
