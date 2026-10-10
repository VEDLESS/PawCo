import { Router } from 'express';
import { PetController } from '../controllers/pet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { petSchema } from '@petco/shared';

const router = Router();

router.post('/', authMiddleware, validate(petSchema), PetController.createPet);
router.get('/', authMiddleware, PetController.getMyPets);
router.get('/:id', authMiddleware, PetController.getPetById);
router.put('/:id', authMiddleware, validate(petSchema.partial()), PetController.updatePet);
router.delete('/:id', authMiddleware, PetController.deletePet);

export default router;
