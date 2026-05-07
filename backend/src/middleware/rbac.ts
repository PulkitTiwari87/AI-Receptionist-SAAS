import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

export const isSuperAdmin = requireRole(['SUPER_ADMIN']);
export const isBusinessOwner = requireRole(['SUPER_ADMIN', 'BUSINESS_OWNER']);
export const isStaff = requireRole(['SUPER_ADMIN', 'BUSINESS_OWNER', 'STAFF']);
