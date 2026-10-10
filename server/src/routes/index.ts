import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import petRoutes from './pet.routes';
import helperRoutes from './helper.routes';
import requestRoutes from './request.routes';
import bookingRoutes from './booking.routes';
import reviewRoutes from './review.routes';
import messageRoutes from './message.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import reportRoutes from './report.routes';
import offerRoutes from './offer.routes';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PetCo Multi-Role API Server',
    version: '2.0.0',
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pets', petRoutes);
router.use('/helpers', helperRoutes);
router.use('/requests', requestRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);
router.use('/offers', offerRoutes);

export default router;
