import { prisma } from '../prisma';

export class UserService {
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        helperProfile: true,
        pets: true,
      },
    });

    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  static async updateProfile(userId: string, data: {
    name?: string;
    phone?: string | null;
    profileImage?: string | null;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        helperProfile: true,
      },
    });

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
