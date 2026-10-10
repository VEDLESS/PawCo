import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { RequestService } from '../services/request.service';

export class RequestController {
  static async createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const request = await RequestService.createRequest(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Pet care request created successfully',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, serviceType, ownerId } = req.query as any;
      const requests = await RequestService.getRequests({
        status,
        serviceType,
        ownerId,
      });
      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const requests = await RequestService.getRequests({
        ownerId: req.user!.userId,
      });
      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNearbyRequestsForHelper(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const requests = await RequestService.getNearbyRequestsForHelper(req.user!.userId);
      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRequestById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const request = await RequestService.getRequestById(req.params.id);
      res.status(200).json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRequestStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await RequestService.updateRequestStatus(req.params.id, req.body.status, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Request status updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await RequestService.deleteRequest(req.params.id, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Service request deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
