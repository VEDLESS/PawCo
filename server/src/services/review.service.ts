import { prisma } from '../prisma';
import { BookingStatus, NotificationType } from '@petco/shared';
import { NotificationService } from './notification.service';

export class ReviewService {
  static async createReview(reviewerId: string, data: {
    bookingId: string;
    rating: number;
    comment?: string | null;
  }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        helper: true,
        owner: true,
        request: { include: { pet: true } },
      },
    });

    if (!booking) {
      const error: any = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      const error: any = new Error('Reviews can only be submitted for completed bookings');
      error.statusCode = 400;
      throw error;
    }

    // Determine reviewed user (if owner reviewed, reviewedUser is helper; and vice versa)
    let reviewedUserId = '';
    if (reviewerId === booking.ownerId) {
      reviewedUserId = booking.helperId;
    } else if (reviewerId === booking.helperId) {
      reviewedUserId = booking.ownerId;
    } else {
      const error: any = new Error('Only participants of this booking can review');
      error.statusCode = 403;
      throw error;
    }

    // Check if reviewer already reviewed this booking
    const existing = await prisma.review.findFirst({
      where: {
        bookingId: data.bookingId,
        reviewerId,
      },
    });

    if (existing) {
      const error: any = new Error('You have already submitted a review for this booking');
      error.statusCode = 409;
      throw error;
    }

    // Create review and recompute helper rating if helper is reviewed
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          bookingId: data.bookingId,
          reviewerId,
          reviewedUserId,
          rating: data.rating,
          comment: data.comment,
        },
        include: {
          reviewer: {
            select: { id: true, name: true, profileImage: true },
          },
        },
      });

      // If the helper was reviewed, recalculate their aggregate rating
      const helperProfile = await tx.helperProfile.findUnique({
        where: { userId: reviewedUserId },
      });

      if (helperProfile) {
        const allReviews = await tx.review.findMany({
          where: { reviewedUserId },
          select: { rating: true },
        });

        const total = allReviews.length;
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / total;

        await tx.helperProfile.update({
          where: { userId: reviewedUserId },
          data: {
            rating: Math.round(avg * 10) / 10,
            totalReviews: total,
          },
        });
      }

      return newReview;
    });

    // Notify reviewed user
    await NotificationService.createNotification({
      userId: reviewedUserId,
      type: NotificationType.NEW_REVIEW,
      title: 'New Rating & Review',
      message: `${review.reviewer.name} left you a ${data.rating}★ review!`,
      data: { reviewId: review.id, bookingId: data.bookingId },
    });

    return review;
  }

  static async getReviewsByUserId(userId: string) {
    return prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: {
          select: { id: true, name: true, profileImage: true },
        },
        booking: {
          include: {
            request: {
              include: { pet: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
