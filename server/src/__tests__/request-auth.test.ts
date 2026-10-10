import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@petco/shared';
import { RequestService } from '../services/request.service';
import { prisma } from '../prisma';

describe('Role Authorization & Request Creation Security', () => {
  describe('requireRole middleware', () => {
    const mockResponse = () => {
      const res: any = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should deny unauthenticated requests with 401', () => {
      const middleware = requireRole(Role.CUSTOMER, Role.OWNER);
      const req: any = {};
      const res = mockResponse();
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Authentication required' }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow user with role CUSTOMER when Role.OWNER is required', () => {
      const middleware = requireRole(Role.OWNER);
      const req: any = { user: { userId: 'user-1', role: Role.CUSTOMER } };
      const res = mockResponse();
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow user with role OWNER when Role.CUSTOMER is required', () => {
      const middleware = requireRole(Role.CUSTOMER);
      const req: any = { user: { userId: 'user-1', role: Role.OWNER } };
      const res = mockResponse();
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny user with role HELPER when Role.CUSTOMER/Role.OWNER is required', () => {
      const middleware = requireRole(Role.CUSTOMER, Role.OWNER);
      const req: any = { user: { userId: 'helper-1', role: Role.HELPER } };
      const res = mockResponse();
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Access denied'),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny user with role ADMIN when only Role.HELPER is required', () => {
      const middleware = requireRole(Role.HELPER);
      const req: any = { user: { userId: 'admin-1', role: Role.ADMIN } };
      const res = mockResponse();
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Pet Ownership Validation in RequestService', () => {
    it('should reject request creation if pet belongs to another user', async () => {
      jest.spyOn(prisma.pet, 'findFirst').mockResolvedValue(null as any);

      await expect(
        RequestService.createRequest('attacker-id', {
          petId: 'victim-pet-id',
          serviceType: 'DOG_WALKING' as any,
          title: 'Walk',
          description: 'Walk',
          location: 'Location',
          latitude: 37.7,
          longitude: -122.4,
          scheduledDate: '2026-10-12',
          startTime: '10:00',
          budget: 30,
        })
      ).rejects.toThrow('Pet not found or does not belong to you');
    });

    it('should allow request creation if pet belongs to the authenticated owner', async () => {
      const mockPet: any = { id: 'pet-1', ownerId: 'owner-1', name: 'Milo' };
      const mockCreatedRequest: any = {
        id: 'req-1',
        ownerId: 'owner-1',
        petId: 'pet-1',
        title: 'Walk',
        budget: 35,
        pet: mockPet,
      };

      jest.spyOn(prisma.pet, 'findFirst').mockResolvedValue(mockPet);
      jest.spyOn(prisma.serviceRequest, 'create').mockResolvedValue(mockCreatedRequest);
      jest.spyOn(prisma.helperProfile, 'findMany').mockResolvedValue([]);

      const result = await RequestService.createRequest('owner-1', {
        petId: 'pet-1',
        serviceType: 'DOG_WALKING' as any,
        title: 'Walk',
        description: 'Friendly dog walk',
        location: 'Dolores Park',
        latitude: 37.7,
        longitude: -122.4,
        scheduledDate: '2026-10-12',
        startTime: '14:00',
        budget: 35,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('req-1');
      expect(result.ownerId).toBe('owner-1');
    });
  });
});
