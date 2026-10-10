import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { prisma } from '../prisma';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication token is missing or malformed',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Verify user exists and is not suspended
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isSuspended: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found or account was deleted',
      });
      return;
    }

    if (user.isSuspended) {
      res.status(403).json({
        success: false,
        error: 'Account has been suspended by administration',
      });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role as any,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
    });
  }
};
