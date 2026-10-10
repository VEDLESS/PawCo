import { prisma } from '../prisma';
import { VerificationStatus, NotificationType } from '@petco/shared';
import { NotificationService } from './notification.service';
import { AuditService } from './audit.service';

export class AdminService {
  static async getPlatformStats() {
    const [
      totalUsers,
      totalCustomers,
      totalHelpers,
      verifiedHelpers,
      pendingVerifications,
      totalPets,
      totalRequests,
      emergencyRequests,
      totalBookings,
      completedBookings,
      revenueResult,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: { in: ['CUSTOMER', 'OWNER'] } } }),
      prisma.user.count({ where: { role: 'HELPER' } }),
      prisma.helperProfile.count({ where: { verificationStatus: VerificationStatus.VERIFIED } }),
      prisma.helperProfile.count({ where: { verificationStatus: { in: [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW] } } }),
      prisma.pet.count(),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { isEmergency: true, status: 'OPEN' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: { in: ['COMPLETED', 'CUSTOMER_CONFIRMED'] } } }),
      prisma.booking.aggregate({
        where: { status: { in: ['COMPLETED', 'CUSTOMER_CONFIRMED'] } },
        _sum: { agreedPrice: true },
      }),
    ]);

    const grossVolume = revenueResult._sum.agreedPrice || 0;
    const platformFee = Math.round(grossVolume * 0.15 * 100) / 100; // 15% platform take-rate

    return {
      totalUsers,
      totalCustomers,
      totalHelpers,
      verifiedHelpers,
      pendingVerifications,
      totalPets,
      totalRequests,
      emergencyRequests,
      totalBookings,
      completedBookings,
      grossVolume,
      platformRevenue: platformFee,
    };
  }

  static async getLiveActivityFeed(limit = 20) {
    const [recentRequests, recentBookings, recentUsers, recentReviews] = await Promise.all([
      prisma.serviceRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { name: true } }, pet: { select: { name: true } } },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          owner: { select: { name: true } },
          helper: { select: { name: true } },
          request: { select: { serviceType: true, pet: { select: { name: true } } } },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, role: true, location: true, createdAt: true },
      }),
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { name: true } },
          reviewedUser: { select: { name: true } },
        },
      }),
    ]);

    const activities: any[] = [];

    recentRequests.forEach((r) => {
      activities.push({
        id: `req-${r.id}`,
        type: 'REQUEST_CREATED',
        message: `${r.owner.name} created ${r.isEmergency ? '🚨 EMERGENCY' : ''} ${r.serviceType.replace(/_/g, ' ')} request for ${r.pet.name}`,
        timestamp: r.createdAt,
      });
    });

    recentBookings.forEach((b) => {
      activities.push({
        id: `book-${b.id}`,
        type: 'BOOKING_UPDATE',
        message: `Booking for ${b.request.pet.name}: Status changed to ${b.status.replace(/_/g, ' ')} (${b.helper.name})`,
        timestamp: b.updatedAt,
      });
    });

    recentUsers.forEach((u) => {
      activities.push({
        id: `user-${u.id}`,
        type: 'USER_REGISTERED',
        message: `New ${u.role.toLowerCase()} joined PetCo: ${u.name} (${u.location || 'Local'})`,
        timestamp: u.createdAt,
      });
    });

    recentReviews.forEach((rev) => {
      activities.push({
        id: `rev-${rev.id}`,
        type: 'REVIEW_POSTED',
        message: `${rev.reviewer.name} gave a ${rev.rating}★ review to ${rev.reviewedUser.name}`,
        timestamp: rev.createdAt,
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  static async getEmergencyRequests() {
    return prisma.serviceRequest.findMany({
      where: { isEmergency: true },
      include: {
        owner: { select: { id: true, name: true, phone: true, email: true, location: true } },
        pet: true,
        bookings: { include: { helper: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllUsers(filters?: { role?: any; searchTerm?: string }) {
    return prisma.user.findMany({
      where: {
        ...(filters?.role && { role: filters.role }),
        ...(filters?.searchTerm && {
          OR: [
            { name: { contains: filters.searchTerm, mode: 'insensitive' } },
            { email: { contains: filters.searchTerm, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isSuspended: true,
        profileImage: true,
        location: true,
        createdAt: true,
        helperProfile: true,
        _count: {
          select: { pets: true, ownerBookings: true, helperBookings: true, filedReports: true, receivedReports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async toggleUserSuspension(adminId: string, userId: string, isSuspended: boolean) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended },
      select: { id: true, name: true, email: true, isSuspended: true },
    });

    await AuditService.log({
      adminId,
      action: isSuspended ? 'SUSPEND_USER' : 'REACTIVATE_USER',
      targetType: 'USER',
      targetId: userId,
      details: { userName: user.name, userEmail: user.email },
    });

    return user;
  }

  static async verifyHelper(adminId: string, helperProfileId: string, status: VerificationStatus) {
    const profile = await prisma.helperProfile.update({
      where: { id: helperProfileId },
      data: { verificationStatus: status },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await AuditService.log({
      adminId,
      action: `VERIFY_HELPER_${status}`,
      targetType: 'HELPER_PROFILE',
      targetId: helperProfileId,
      details: { helperName: profile.user.name, status },
    });

    await NotificationService.createNotification({
      userId: profile.userId,
      type: NotificationType.VERIFICATION_UPDATE,
      title: 'Helper Verification Update',
      message: status === VerificationStatus.VERIFIED
        ? 'Congratulations! Your PetCo helper profile is now Verified with a badge.'
        : `Your verification status was updated to ${status}.`,
      data: { status },
    });

    return profile;
  }

  static async getAllRequests() {
    return prisma.serviceRequest.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, phone: true } },
        pet: true,
        offers: { include: { helper: { select: { id: true, name: true } } } },
        bookings: { include: { helper: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
        helper: { select: { id: true, name: true, email: true } },
        request: { include: { pet: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
