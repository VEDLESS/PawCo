import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { PetService } from '../services/pet.service';

export class PetController {
  static async createPet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pet = await PetService.createPet(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Pet profile created successfully',
        data: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyPets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pets = await PetService.getPetsByOwner(req.user!.userId);
      res.status(200).json({
        success: true,
        data: pets,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPetById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pet = await PetService.getPetById(req.params.id);
      res.status(200).json({
        success: true,
        data: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updatedPet = await PetService.updatePet(req.params.id, req.user!.userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Pet updated successfully',
        data: updatedPet,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await PetService.deletePet(req.params.id, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Pet deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
