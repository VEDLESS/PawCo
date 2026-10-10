import { prisma } from '../prisma';
import { BookingStatus, RequestStatus, NotificationType } from '@petco/shared';
import { NotificationService } from './notification.service';

export class BookingService {
  static async createBooking(data: {
    requestId: string;
    helperId: string;
    agreedPrice: number;
    initiatorUserId: string;
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

    if (request.status !== RequestStatus.OPEN && request.status !== RequestStatus.ACCEPTED) {
      const error: any = new Error('This service request is no longer open');
      error.statusCode = 400;
      throw error;
    }

    const helper = await prisma.user.findUnique({
      where: { id: data.helperId },
    });

    if (!helper) {
      const error: any = new Error('Helper not found');
      error.statusCode = 404;
      throw error;
    }

    // Run in transaction: create booking & update request status
    const booking = await prisma.$transaction(async (tx) => {
      await tx.serviceRequest.update({
        where: { id: data.requestId },
        data: { status: RequestStatus.CONFIRMED },
      });

      return tx.booking.create({
        data: {
          requestId: data.requestId,
          ownerId: request.ownerId,
          helperId: data.helperId,
          agreedPrice: data.agreedPrice,
          status: BookingStatus.CONFIRMED,
        },
        include: {
          request: {
            include: { pet: true },
          },
          owner: {
            select: { id: true, name: true, phone: true, profileImage: true, location: true },
          },
          helper: {
            select: { id: true, name: true, phone: true, profileImage: true, location: true },
          },
        },
      });
    });

    const recipientId = data.initiatorUserId === request.ownerId ? data.helperId : request.ownerId;
    const isOwnerRecipient = recipientId === request.ownerId;

    await NotificationService.createNotification({
      userId: recipientId,
      type: NotificationType.BOOKING_CONFIRMED,
      title: 'Booking Confirmed!',
      message: isOwnerRecipient
        ? `${helper.name} confirmed booking for ${request.pet.name}!`
        : `${request.owner.name} confirmed booking for ${request.pet.name}!`,
      data: { bookingId: booking.id, requestId: request.id },
    });

    return booking;
  }

  static async getBookings(filters: {
    userId: string;
    role: string;
    status?: BookingStatus;
  }) {
    const where: any = {};
    if (filters.role === 'CUSTOMER' || filters.role === 'OWNER') {
      where.ownerId = filters.userId;
    } else if (filters.role === 'HELPER') {
      where.helperId = filters.userId;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    return prisma.booking.findMany({
      where,
      include: {
        request: {
          include: { pet: true },
        },
        owner: {
          select: { id: true, name: true, phone: true, profileImage: true, location: true },
        },
        helper: {
          select: { id: true, name: true, phone: true, profileImage: true, location: true },
        },
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getBookingById(bookingId: string, userId?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        request: {
          include: { pet: true },
        },
        owner: {
          select: { id: true, name: true, phone: true, profileImage: true, location: true },
        },
        helper: {
          select: { id: true, name: true, phone: true, profileImage: true, location: true },
        },
        reviews: {
          include: {
            reviewer: { select: { id: true, name: true, profileImage: true } },
          },
        },
      },
    });

    if (!booking) {
      const error: any = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    if (userId && booking.ownerId !== userId && booking.helperId !== userId) {
      const error: any = new Error('Unauthorized to view this booking');
      error.statusCode = 403;
      throw error;
    }

    return booking;
  }

  static async updateStatus(bookingId: string, status: BookingStatus, userId: string) {
    const booking = await this.getBookingById(bookingId, userId);

    const updateData: any = { status };
    if (status === BookingStatus.IN_PROGRESS && !booking.startedAt) {
      updateData.startedAt = new Date();
    }
    if ((status === BookingStatus.COMPLETED || status === BookingStatus.CUSTOMER_CONFIRMED) && !booking.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Sync request status
      let reqStatus = RequestStatus.CONFIRMED;
      if (status === BookingStatus.IN_PROGRESS) reqStatus = RequestStatus.IN_PROGRESS;
      else if (status === BookingStatus.COMPLETED || status === BookingStatus.CUSTOMER_CONFIRMED) reqStatus = RequestStatus.COMPLETED;
      else if (status === BookingStatus.CANCELLED) reqStatus = RequestStatus.CANCELLED;
      else if (status === BookingStatus.DISPUTED) reqStatus = RequestStatus.DISPUTED;

      await tx.serviceRequest.update({
        where: { id: booking.requestId },
        data: { status: reqStatus },
      });

      return tx.booking.update({
        where: { id: bookingId },
        data: updateData,
        include: {
          request: { include: { pet: true } },
          owner: { select: { id: true, name: true, phone: true, profileImage: true } },
          helper: { select: { id: true, name: true, phone: true, profileImage: true } },
        },
      });
    });

    const recipientId = userId === booking.ownerId ? booking.helperId : booking.ownerId;
    let notifTitle = 'Booking Update';
    let notifMessage = `Booking status changed to ${status.replace(/_/g, ' ').toLowerCase()}`;

    if (status === BookingStatus.HELPER_ON_THE_WAY) {
      notifTitle = 'Helper is on the way!';
      notifMessage = `${booking.helper.name} is traveling to your location.`;
    } else if (status === BookingStatus.IN_PROGRESS) {
      notifTitle = 'Service Started';
      notifMessage = `${booking.helper.name} has started the pet care service!`;
    } else if (status === BookingStatus.COMPLETED) {
      notifTitle = 'Service Completed';
      notifMessage = `Care service for ${booking.request.pet.name} has been marked complete by helper.`;
    } else if (status === BookingStatus.CUSTOMER_CONFIRMED) {
      notifTitle = 'Customer Confirmed Completion';
      notifMessage = `${booking.owner.name} confirmed completion of the service. Great job!`;
    }

    await NotificationService.createNotification({
      userId: recipientId,
      type: status === BookingStatus.HELPER_ON_THE_WAY
        ? NotificationType.HELPER_ON_THE_WAY
        : status === BookingStatus.IN_PROGRESS
        ? NotificationType.BOOKING_IN_PROGRESS
        : status === BookingStatus.COMPLETED
        ? NotificationType.BOOKING_COMPLETED
        : status === BookingStatus.CUSTOMER_CONFIRMED
        ? NotificationType.CUSTOMER_CONFIRMED
        : NotificationType.BOOKING_CANCELLED,
      title: notifTitle,
      message: notifMessage,
      data: { bookingId: booking.id },
    });

    return updatedBooking;
  }
}
