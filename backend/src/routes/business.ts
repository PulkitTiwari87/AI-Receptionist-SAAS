import express from 'express';
import Business from '../models/Business';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get current business profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business profile', error });
  }
});

// Update business profile
router.patch('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const business = await Business.findByIdAndUpdate(businessId, req.body, { new: true });
    if (!business) return res.status(404).json({ message: 'Business not found' });

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Error updating business profile', error });
  }
});

export default router;
