import { prisma } from '../prisma';
import { NotificationType } from '@petco/shared';
import { NotificationService } from './notification.service';
import { BookingService } from './booking.service';

export class OfferService {
  static async createOffer(helperId: string, data: {
    requestId: string;
    offeredPrice: number;
    proposedTime?: string;
    note?: string;
  }) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: data.requestId },
      include: { owner: true, pet: true },
    });

    if (!request) {
      const error: any = new Error('Service request not found');
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== 'OPEN') {
      const error: any = new Error('Service request is no longer open for offers');
      error.statusCode = 400;
      throw error;
    }

    const offer = await prisma.helperOffer.create({
      data: {
        requestId: data.requestId,
        helperId,
        offeredPrice: data.offeredPrice,
        proposedTime: data.proposedTime,
        note: data.note,
        status: 'PENDING',
      },
      include: {
        helper: {
          select: { id: true, name: true, profileImage: true, phone: true },
        },
      },
    });

    // Notify customer/owner of new offer
    await NotificationService.createNotification({
      userId: request.ownerId,
      type: NotificationType.OFFER_RECEIVED,
      title: 'New Offer on Your Pet Care Request',
      message: `${offer.helper.name} offered $${data.offeredPrice.toFixed(2)} for ${request.pet.name}`,
      data: { offerId: offer.id, requestId: request.id },
    });

    return offer;
  }

  static async acceptOffer(ownerId: string, offerId: string) {
    const offer = await prisma.helperOffer.findUnique({
      where: { id: offerId },
      include: { request: true },
    });

    if (!offer) {
      const error: any = new Error('Offer not found');
      error.statusCode = 404;
      throw error;
    }

    if (offer.request.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to accept this offer');
      error.statusCode = 403;
      throw error;
    }

    // Mark offer accepted
    await prisma.helperOffer.update({
      where: { id: offerId },
      data: { status: 'ACCEPTED' },
    });

    // Create booking
    return BookingService.createBooking({
      requestId: offer.requestId,
      helperId: offer.helperId,
      agreedPrice: offer.offeredPrice,
      initiatorUserId: ownerId,
    });
  }
}
