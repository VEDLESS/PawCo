import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { messageSchema } from '@petco/shared';

const router = Router();

router.post('/', authMiddleware, validate(messageSchema), MessageController.sendMessage);
router.get('/booking/:bookingId', authMiddleware, MessageController.getMessagesByBooking);
router.patch('/booking/:bookingId/read', authMiddleware, MessageController.markAsRead);

export default router;
