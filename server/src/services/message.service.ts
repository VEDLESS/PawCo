import { prisma } from '../prisma';
import { NotificationType } from '@petco/shared';
import { NotificationService } from './notification.service';

export class MessageService {
  static async sendMessage(senderId: string, data: {
    bookingId: string;
    receiverId: string;
    message: string;
  }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { owner: true, helper: true },
    });

    if (!booking) {
      const error: any = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    if (booking.ownerId !== senderId && booking.helperId !== senderId) {
      const error: any = new Error('Unauthorized to message in this booking chat');
      error.statusCode = 403;
      throw error;
    }

    const newMessage = await prisma.message.create({
      data: {
        bookingId: data.bookingId,
        senderId,
        receiverId: data.receiverId,
        message: data.message,
      },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true },
        },
        receiver: {
          select: { id: true, name: true, profileImage: true },
        },
      },
    });

    // Create notification for receiver
    await NotificationService.createNotification({
      userId: data.receiverId,
      type: NotificationType.NEW_MESSAGE,
      title: `Message from ${newMessage.sender.name}`,
      message: data.message.length > 60 ? `${data.message.substring(0, 57)}...` : data.message,
      data: { bookingId: data.bookingId, messageId: newMessage.id },
    });

    return newMessage;
  }

  static async getMessagesByBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      const error: any = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    if (booking.ownerId !== userId && booking.helperId !== userId) {
      const error: any = new Error('Unauthorized to view messages for this booking');
      error.statusCode = 403;
      throw error;
    }

    return prisma.message.findMany({
      where: { bookingId },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async markAsRead(bookingId: string, userId: string) {
    return prisma.message.updateMany({
      where: {
        bookingId,
        receiverId: userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }
}
