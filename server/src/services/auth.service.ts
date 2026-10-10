import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { Role, AuthResponse } from '@petco/shared';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: Role;
    location?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      const error: any = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        phone: data.phone,
        role: (data.role as any) || 'OWNER',
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        ...(data.role === Role.HELPER && {
          helperProfile: {
            create: {
              services: ['DOG_WALKING', 'PET_SITTING'],
              hourlyRate: 25,
              serviceRadius: 15,
            },
          },
        }),
      },
      include: {
        helperProfile: true,
      },
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as any,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token to db
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser as any,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: {
        helperProfile: true,
      },
    });

    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (user.isSuspended) {
      const error: any = new Error('This account has been suspended');
      error.statusCode = 403;
      throw error;
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as any,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser as any,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        const error: any = new Error('Invalid or expired refresh token');
        error.statusCode = 401;
        throw error;
      }

      if (storedToken.user.isSuspended) {
        const error: any = new Error('Account suspended');
        error.statusCode = 403;
        throw error;
      }

      // Rotate token: delete old, create new
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      const tokenPayload = {
        userId: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role as any,
      };

      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: storedToken.user.id,
          expiresAt,
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err: any) {
      const error: any = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }
  }

  static async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }
}
