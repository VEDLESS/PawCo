import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ReportService } from '../services/report.service';

export class ReportController {
  static async createReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await ReportService.createReport(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Report submitted successfully. Our safety team will review it.',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.query as any;
      const reports = await ReportService.getReports(status);
      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resolveReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const resolved = await ReportService.resolveReport(req.user!.userId, req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Report resolved',
        data: resolved,
      });
    } catch (error) {
      next(error);
    }
  }
}
