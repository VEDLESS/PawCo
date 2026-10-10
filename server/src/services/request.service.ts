import { prisma } from '../prisma';
import { calculateDistanceKm } from '../utils/geo';
import { ServiceType, ServiceCategory, RequestStatus, NotificationType } from '@petco/shared';
import { NotificationService } from './notification.service';
import { MatchingService } from './matching.service';

export class RequestService {
  static async createRequest(ownerId: string, data: {
    petId: string;
    category?: ServiceCategory;
    serviceType: ServiceType;
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    scheduledDate: string | Date;
    startTime: string;
    endTime?: string | null;
    budget: number;
    isEmergency?: boolean;
    medicineDetails?: any;
    customFields?: any;
  }) {
    // Verify pet belongs to owner
    const pet = await prisma.pet.findFirst({
      where: { id: data.petId, ownerId },
    });

    if (!pet) {
      const error: any = new Error('Pet not found or does not belong to you');
      error.statusCode = 404;
      throw error;
    }

    const request = await prisma.serviceRequest.create({
      data: {
        ownerId,
        petId: data.petId,
        category: (data.category as any) || 'BASIC_CARE',
        serviceType: data.serviceType,
        title: data.title,
        description: data.description,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        scheduledDate: new Date(data.scheduledDate),
        startTime: data.startTime,
        endTime: data.endTime,
        budget: data.budget,
        isEmergency: data.isEmergency ?? false,
        medicineDetails: data.medicineDetails || null,
        customFields: data.customFields || null,
        status: RequestStatus.OPEN,
      },
      include: {
        pet: true,
        owner: {
          select: { id: true, name: true, profileImage: true, location: true },
        },
      },
    });

    // Notify nearby verified helpers
    try {
      const nearbyHelpers = await prisma.helperProfile.findMany({
        where: {
          isAvailable: true,
          services: { has: data.serviceType },
          user: {
            latitude: { not: null },
            longitude: { not: null },
          },
        },
        include: { user: true },
      });

      for (const h of nearbyHelpers) {
        if (h.user.latitude && h.user.longitude) {
          const dist = calculateDistanceKm(data.latitude, data.longitude, h.user.latitude, h.user.longitude);
          if (dist <= h.serviceRadius) {
            await NotificationService.createNotification({
              userId: h.userId,
              type: data.isEmergency ? NotificationType.EMERGENCY_ALERT : NotificationType.REQUEST_CREATED,
              title: data.isEmergency
                ? `🚨 URGENT: Pet Emergency Care Needed (${dist} km)`
                : `New Pet Care Request Nearby (${dist} km)`,
              message: `${pet.name} needs ${data.serviceType.replace(/_/g, ' ').toLowerCase()} on ${new Date(data.scheduledDate).toLocaleDateString()}`,
              data: { requestId: request.id, isEmergency: data.isEmergency },
            });
          }
        }
      }
    } catch (e) {
      console.warn('Failed to dispatch background nearby notifications:', e);
    }

    return request;
  }

  static async getRequests(filters: {
    ownerId?: string;
    status?: RequestStatus;
    category?: ServiceCategory;
    serviceType?: ServiceType;
    isEmergency?: boolean;
  }) {
    return prisma.serviceRequest.findMany({
      where: {
        ...(filters.ownerId && { ownerId: filters.ownerId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        ...(filters.serviceType && { serviceType: filters.serviceType }),
        ...(filters.isEmergency !== undefined && { isEmergency: filters.isEmergency }),
      },
      include: {
        pet: true,
        owner: {
          select: { id: true, name: true, profileImage: true, location: true },
        },
        offers: {
          include: {
            helper: { select: { id: true, name: true, profileImage: true, phone: true } },
          },
        },
        bookings: {
          include: {
            helper: {
              select: { id: true, name: true, profileImage: true, phone: true },
            },
          },
        },
      },
      orderBy: [{ isEmergency: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async getNearbyRequestsForHelper(helperUserId: string, filters?: {
    category?: ServiceCategory;
    isEmergency?: boolean;
    maxDistanceKm?: number;
  }) {
    const helper = await prisma.helperProfile.findUnique({
      where: { userId: helperUserId },
      include: { user: true },
    });

    const openRequests = await prisma.serviceRequest.findMany({
      where: {
        status: RequestStatus.OPEN,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isEmergency !== undefined && { isEmergency: filters.isEmergency }),
      },
      include: {
        pet: true,
        owner: {
          select: { id: true, name: true, profileImage: true, location: true },
        },
        offers: {
          where: { helperId: helperUserId },
        },
      },
      orderBy: [{ isEmergency: 'desc' }, { createdAt: 'desc' }],
    });

    if (!helper?.user?.latitude || !helper?.user?.longitude) {
      return openRequests;
    }

    const requestsWithDistance = openRequests
      .map((req) => {
        const distanceKm = calculateDistanceKm(
          helper.user.latitude!,
          helper.user.longitude!,
          req.latitude,
          req.longitude
        );
        return {
          ...req,
          distanceKm,
        };
      })
      .filter((req) => {
        const maxDist = filters?.maxDistanceKm || helper.serviceRadius;
        return req.distanceKm <= maxDist;
      })
      .sort((a, b) => (b.isEmergency ? 1 : 0) - (a.isEmergency ? 1 : 0) || a.distanceKm - b.distanceKm);

    return requestsWithDistance;
  }

  static async getRequestById(id: string) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        pet: true,
        owner: {
          select: { id: true, name: true, email: true, phone: true, profileImage: true, location: true },
        },
        offers: {
          include: {
            helper: { select: { id: true, name: true, profileImage: true, phone: true } },
          },
        },
        bookings: {
          include: {
            helper: {
              select: { id: true, name: true, profileImage: true, phone: true },
            },
          },
        },
      },
    });

    if (!request) {
      const error: any = new Error('Service request not found');
      error.statusCode = 404;
      throw error;
    }

    return request;
  }

  static async getRecommendedHelpers(requestId: string) {
    const request = await this.getRequestById(requestId);
    return MatchingService.getRecommendedHelpersForRequest({
      latitude: request.latitude,
      longitude: request.longitude,
      serviceType: request.serviceType as any,
      budget: request.budget,
      scheduledDate: request.scheduledDate,
    });
  }

  static async updateRequestStatus(id: string, status: RequestStatus, userId: string) {
    const request = await this.getRequestById(id);

    if (request.ownerId !== userId) {
      const error: any = new Error('Only the request owner can update status');
      error.statusCode = 403;
      throw error;
    }

    return prisma.serviceRequest.update({
      where: { id },
      data: { status },
    });
  }

  static async deleteRequest(id: string, userId: string) {
    const request = await this.getRequestById(id);

    if (request.ownerId !== userId) {
      const error: any = new Error('Only the request owner can delete this request');
      error.statusCode = 403;
      throw error;
    }

    return prisma.serviceRequest.delete({
      where: { id },
    });
  }
}
