import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { RequestService } from '../services/request.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { serviceRequestSchema, updateRequestStatusSchema, Role } from '@petco/shared';

const router = Router();

router.post('/', authMiddleware, requireRole(Role.CUSTOMER, Role.OWNER), validate(serviceRequestSchema), RequestController.createRequest);
router.get('/', authMiddleware, RequestController.getRequests);
router.get('/my', authMiddleware, RequestController.getMyRequests);
router.get('/nearby', authMiddleware, requireRole(Role.HELPER), RequestController.getNearbyRequestsForHelper);
router.get('/:id/recommendations', authMiddleware, async (req: any, res: any, next: any) => {
  try {
    const recommendations = await RequestService.getRecommendedHelpers(req.params.id);
    res.status(200).json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
});
router.get('/:id', authMiddleware, RequestController.getRequestById);
router.patch('/:id/status', authMiddleware, validate(updateRequestStatusSchema), RequestController.updateRequestStatus);
router.delete('/:id', authMiddleware, RequestController.deleteRequest);

export default router;
