import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { MessageService } from '../services/message.service';

export class MessageController {
  static async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const message = await MessageService.sendMessage(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMessagesByBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const messages = await MessageService.getMessagesByBooking(req.params.bookingId, req.user!.userId);
      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await MessageService.markAsRead(req.params.bookingId, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Messages marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
}
