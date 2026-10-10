import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createReportSchema, resolveReportSchema, Role } from '@petco/shared';

const router = Router();

router.post('/', authMiddleware, validate(createReportSchema), ReportController.createReport);
router.get('/', authMiddleware, requireRole(Role.ADMIN), ReportController.getReports);
router.patch('/:id/status', authMiddleware, requireRole(Role.ADMIN), ReportController.resolveReport);
router.patch('/:id/resolve', authMiddleware, requireRole(Role.ADMIN), validate(resolveReportSchema), ReportController.resolveReport);

export default router;
