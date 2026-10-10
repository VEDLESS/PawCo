import { prisma } from '../prisma';
import { calculateDistanceKm } from '../utils/geo';
import { ServiceType, ServiceCategory, VerificationStatus, MatchScoredHelper } from '@petco/shared';

export class MatchingService {
  /**
   * Smart Matching Algorithm: Ranks verified and available helpers for a customer's request
   */
  static async getRecommendedHelpersForRequest(params: {
    latitude: number;
    longitude: number;
    serviceType: ServiceType;
    budget: number;
    scheduledDate?: string | Date;
    radiusKm?: number;
  }): Promise<MatchScoredHelper[]> {
    const { latitude, longitude, serviceType, budget, radiusKm = 25 } = params;

    // Fetch all active helpers offering this service or related category
    const helpers = await prisma.helperProfile.findMany({
      where: {
        isAvailable: true,
        user: {
          isSuspended: false,
          latitude: { not: null },
          longitude: { not: null },
        },
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

    const scoredHelpers: MatchScoredHelper[] = [];

    for (const helper of helpers) {
      const helperLat = helper.user.latitude!;
      const helperLon = helper.user.longitude!;
      const distanceKm = calculateDistanceKm(latitude, longitude, helperLat, helperLon);

      // Must be within search radius and within helper's own coverage radius
      if (distanceKm > radiusKm || distanceKm > helper.serviceRadius) {
        continue;
      }

      let score = 50; // Baseline score
      const reasons: string[] = [];

      // 1. Exact Service Match (+25 pts)
      if (helper.services.includes(serviceType)) {
        score += 25;
        reasons.push('Offers exact requested service');
      } else {
        score -= 20;
      }

      // 2. Verification Status (+15 pts for verified)
      if (helper.verificationStatus === VerificationStatus.VERIFIED) {
        score += 15;
        reasons.push('Verified & Background-Checked');
      }

      // 3. Proximity bonus (up to +15 pts for very close proximity < 3km)
      if (distanceKm <= 3) {
        score += 15;
        reasons.push(`Super close (${distanceKm} km away)`);
      } else if (distanceKm <= 7) {
        score += 10;
        reasons.push(`Nearby neighborhood (${distanceKm} km)`);
      } else {
        score += 5;
      }

      // 4. Reputation & Rating bonus (up to +15 pts)
      if (helper.rating >= 4.9) {
        score += 15;
        reasons.push(`Top Rated (${helper.rating}★ with ${helper.totalReviews} reviews)`);
      } else if (helper.rating >= 4.5) {
        score += 10;
        reasons.push(`Highly Rated (${helper.rating}★)`);
      }

      // 5. Budget Compatibility (if helper rate <= budget, +10 pts)
      const helperRate = (helper.pricing as any)?.[serviceType] || helper.hourlyRate;
      if (helperRate <= budget) {
        score += 10;
        reasons.push(`Within budget ($${helperRate} vs $${budget} budget)`);
      }

      // Clamp score between 0 and 100
      const finalScore = Math.min(100, Math.max(10, score));

      scoredHelpers.push({
        helper: helper as any,
        distanceKm,
        matchScore: finalScore,
        reasons,
      });
    }

    // Sort descending by match score
    return scoredHelpers.sort((a, b) => b.matchScore - a.matchScore || a.distanceKm - b.distanceKm);
  }
}
