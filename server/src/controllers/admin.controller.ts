import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AdminService } from '../services/admin.service';
import { prisma } from '../prisma';

export class AdminController {
  static async getPlatformStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getPlatformStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { role, searchTerm } = req.query as any;
      const users = await AdminService.getAllUsers({ role, searchTerm });
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLiveActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const feed = await AdminService.getLiveActivityFeed();
      res.status(200).json({
        success: true,
        data: feed,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmergencyRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const emergencies = await AdminService.getEmergencyRequests();
      res.status(200).json({
        success: true,
        data: emergencies,
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleSuspension(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { isSuspended } = req.body;
      const updated = await AdminService.toggleUserSuspension(req.user!.userId, req.params.userId, isSuspended);
      res.status(200).json({
        success: true,
        message: `User ${isSuspended ? 'suspended' : 'reactivated'} successfully`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyHelper(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const updated = await AdminService.verifyHelper(req.user!.userId, req.params.helperProfileId, status);
      res.status(200).json({
        success: true,
        message: `Helper verification status updated to ${status}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const requests = await AdminService.getAllRequests();
      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const bookings = await AdminService.getAllBookings();
      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const logs = await prisma.auditLog.findMany({
        include: { admin: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
}
