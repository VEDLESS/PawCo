import { prisma } from '../prisma';
import { calculateDistanceKm } from '../utils/geo';
import { ServiceType, VerificationStatus } from '@petco/shared';

export class HelperService {
  static async upsertHelperProfile(userId: string, data: {
    bio?: string | null;
    experience?: string | null;
    hourlyRate?: number;
    serviceRadius?: number;
    services?: ServiceType[];
    isAvailable?: boolean;
  }) {
    return prisma.helperProfile.upsert({
      where: { userId },
      update: {
        ...data,
      },
      create: {
        userId,
        bio: data.bio,
        experience: data.experience,
        hourlyRate: data.hourlyRate ?? 25.0,
        serviceRadius: data.serviceRadius ?? 15.0,
        services: data.services ?? ['DOG_WALKING', 'PET_SITTING'],
        isAvailable: data.isAvailable ?? true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            location: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });
  }

  static async getHelperProfileByUserId(userId: string) {
    const profile = await prisma.helperProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            location: true,
            latitude: true,
            longitude: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      const error: any = new Error('Helper profile not found');
      error.statusCode = 404;
      throw error;
    }

    return profile;
  }

  static async getNearbyHelpers(params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    serviceType?: ServiceType;
  }) {
    const { latitude, longitude, radiusKm = 15, serviceType } = params;

    const helpers = await prisma.helperProfile.findMany({
      where: {
        isAvailable: true,
        verificationStatus: VerificationStatus.VERIFIED,
        user: {
          isSuspended: false,
          latitude: { not: null },
          longitude: { not: null },
        },
        ...(serviceType && {
          services: {
            has: serviceType,
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            location: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    // Calculate distance and filter by helper's coverage radius and search radius
    const nearby = helpers
      .map((helper) => {
        const helperLat = helper.user.latitude!;
        const helperLon = helper.user.longitude!;
        const distanceKm = calculateDistanceKm(latitude, longitude, helperLat, helperLon);

        return {
          helper,
          distanceKm,
        };
      })
      .filter((item) => item.distanceKm <= radiusKm && item.distanceKm <= item.helper.serviceRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm || b.helper.rating - a.helper.rating);

    return nearby;
  }

  static async searchHelpers(filters: {
    serviceType?: ServiceType;
    maxRate?: number;
    minRating?: number;
    searchTerm?: string;
  }) {
    const { serviceType, maxRate, minRating, searchTerm } = filters;

    return prisma.helperProfile.findMany({
      where: {
        isAvailable: true,
        user: {
          isSuspended: false,
          ...(searchTerm && {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { location: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }),
        },
        ...(serviceType && {
          services: {
            has: serviceType,
          },
        }),
        ...(maxRate && {
          hourlyRate: { lte: maxRate },
        }),
        ...(minRating && {
          rating: { gte: minRating },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            location: true,
          },
        },
      },
      orderBy: [{ rating: 'desc' }, { totalReviews: 'desc' }],
    });
  }
}
