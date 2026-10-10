import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@petco/shared';

const router = Router();

// All admin routes require ADMIN role
router.use(authMiddleware, requireRole(Role.ADMIN));

router.get('/stats', AdminController.getPlatformStats);
router.get('/activity', AdminController.getLiveActivity);
router.get('/emergencies', AdminController.getEmergencyRequests);
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:userId/suspend', AdminController.toggleSuspension);
router.patch('/helpers/:helperProfileId/verify', AdminController.verifyHelper);
router.get('/requests', AdminController.getAllRequests);
router.get('/bookings', AdminController.getAllBookings);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
