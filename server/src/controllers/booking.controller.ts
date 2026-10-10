import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { BookingService } from '../services/booking.service';

export class BookingController {
  static async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.createBooking({
        requestId: req.body.requestId,
        helperId: req.body.helperId,
        agreedPrice: req.body.agreedPrice,
        initiatorUserId: req.user!.userId,
      });
      res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.query as any;
      const bookings = await BookingService.getBookings({
        userId: req.user!.userId,
        role: req.user!.role as any,
        status,
      });
      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBookingById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.getBookingById(req.params.id, req.user!.userId);
      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await BookingService.updateStatus(req.params.id, req.body.status, req.user!.userId);
      res.status(200).json({
        success: true,
        message: `Booking status updated to ${req.body.status}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
