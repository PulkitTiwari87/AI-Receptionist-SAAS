import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireTenant = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Super Admins bypass tenant restriction or can specify tenant in query/body
  if (req.user.role === 'SUPER_ADMIN') {
    const targetTenantId = req.query.tenantId || req.body.tenantId;
    if (targetTenantId) {
      req.user.businessId = targetTenantId as string;
    }
    return next();
  }

  if (!req.user.businessId) {
    return res.status(403).json({ message: 'Forbidden: No business context found' });
  }

  // Inject businessId into query/body to enforce scoping in downstream controllers
  if (req.method === 'GET') {
    req.query.businessId = req.user.businessId;
  } else {
    req.body.businessId = req.user.businessId;
  }

  next();
};
