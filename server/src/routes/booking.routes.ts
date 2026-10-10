import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBookingSchema, updateBookingStatusSchema } from '@petco/shared';

const router = Router();

router.post('/', authMiddleware, validate(createBookingSchema), BookingController.createBooking);
router.get('/', authMiddleware, BookingController.getMyBookings);
router.get('/:id', authMiddleware, BookingController.getBookingById);
router.patch('/:id/status', authMiddleware, validate(updateBookingStatusSchema), BookingController.updateStatus);

export default router;
