import { prisma } from '../prisma';

export class PetService {
  static async createPet(ownerId: string, data: {
    name: string;
    species: string;
    breed?: string | null;
    age?: number | null;
    gender?: string | null;
    weight?: number | null;
    description?: string | null;
    medicalConditions?: string | null;
    allergies?: string | null;
    vaccinations?: string | null;
    medications?: string | null;
    specialInstructions?: string | null;
    behaviorNotes?: string | null;
    emergencyNotes?: string | null;
    image?: string | null;
  }) {
    return prisma.pet.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  static async getPetsByOwner(ownerId: string) {
    return prisma.pet.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      include: {
        serviceRequests: {
          where: {
            status: { in: ['OPEN', 'ACCEPTED', 'IN_PROGRESS'] },
          },
          take: 3,
        },
      },
    });
  }

  static async getPetById(petId: string, ownerId?: string) {
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        owner: {
          select: { id: true, name: true, email: true, location: true },
        },
        serviceRequests: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!pet) {
      const error: any = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }

    if (ownerId && pet.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to access this pet profile');
      error.statusCode = 403;
      throw error;
    }

    return pet;
  }

  static async updatePet(petId: string, ownerId: string, data: Partial<{
    name: string;
    species: string;
    breed: string | null;
    age: number | null;
    gender: string | null;
    weight: number | null;
    description: string | null;
    medicalConditions: string | null;
    allergies: string | null;
    vaccinations: string | null;
    medications: string | null;
    specialInstructions: string | null;
    behaviorNotes: string | null;
    emergencyNotes: string | null;
    image: string | null;
  }>) {
    await this.getPetById(petId, ownerId);

    return prisma.pet.update({
      where: { id: petId },
      data,
    });
  }

  static async deletePet(petId: string, ownerId: string) {
    await this.getPetById(petId, ownerId);

    return prisma.pet.delete({
      where: { id: petId },
    });
  }
}
