import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { Role } from '@petco/shared';

export const requireRole = (...allowedRoles: (Role | string)[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const userRole = req.user.role;

    // Normalize CUSTOMER and OWNER interchangeably (both represent pet owners)
    const expandedAllowed = new Set<string>();
    for (const r of allowedRoles) {
      expandedAllowed.add(r);
      if (r === Role.OWNER || r === Role.CUSTOMER || r === 'OWNER' || r === 'CUSTOMER') {
        expandedAllowed.add(Role.OWNER);
        expandedAllowed.add(Role.CUSTOMER);
        expandedAllowed.add('OWNER');
        expandedAllowed.add('CUSTOMER');
      }
    }

    if (!expandedAllowed.has(userRole)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};
