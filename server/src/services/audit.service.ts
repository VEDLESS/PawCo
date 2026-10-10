import { prisma } from '../prisma';

export class AuditService {
  static async log(data: {
    adminId: string;
    action: string;
    targetType: string;
    targetId?: string;
    details?: Record<string, any>;
  }) {
    return prisma.auditLog.create({
      data: {
        adminId: data.adminId,
        action: data.action,
        targetType: data.targetType,
        targetId: data.targetId,
        details: data.details || {},
      },
    });
  }

  static async getLogs(take = 50) {
    return prisma.auditLog.findMany({
      include: {
        admin: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}
