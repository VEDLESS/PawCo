import { prisma } from '../prisma';
import { ReportReason, ReportStatus, NotificationType } from '@petco/shared';
import { NotificationService } from './notification.service';
import { AuditService } from './audit.service';

export class ReportService {
  static async createReport(reporterId: string, data: {
    reportedUserId: string;
    reason: ReportReason;
    description: string;
  }) {
    if (reporterId === data.reportedUserId) {
      const error: any = new Error('You cannot report your own account');
      error.statusCode = 400;
      throw error;
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedUserId: data.reportedUserId,
        reason: data.reason,
        description: data.description,
        status: ReportStatus.OPEN,
      },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } },
      },
    });

    return report;
  }

  static async getReports(status?: ReportStatus) {
    return prisma.report.findMany({
      where: status ? { status } : undefined,
      include: {
        reporter: { select: { id: true, name: true, email: true, profileImage: true } },
        reportedUser: { select: { id: true, name: true, email: true, role: true, isSuspended: true, profileImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async resolveReport(adminId: string, reportId: string, data: {
    status: ReportStatus;
    resolutionNotes?: string;
  }) {
    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: data.status,
        resolutionNotes: data.resolutionNotes,
      },
      include: {
        reportedUser: true,
      },
    });

    await AuditService.log({
      adminId,
      action: `Resolved Report (${data.status})`,
      targetType: 'REPORT',
      targetId: reportId,
      details: { resolutionNotes: data.resolutionNotes, reportedUserId: report.reportedUserId },
    });

    return report;
  }
}
