import express from 'express';
import mongoose from 'mongoose';
import CallLog from '../models/CallLog';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all call logs for a business
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const calls = await CallLog.find({ businessId }).sort({ createdAt: -1 });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call logs', error });
  }
});

// Get a single call log
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const call = await CallLog.findOne({
      _id: req.params.id,
      businessId: req.user?.businessId
    });

    if (!call) return res.status(404).json({ message: 'Call log not found' });
    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call log', error });
  }
});

// Stats for dashboard
router.get('/stats/summary', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    const totalCalls = await CallLog.countDocuments({ businessId });
    const missedCalls = await CallLog.countDocuments({ businessId, status: 'missed' });
    const totalDuration = await CallLog.aggregate([
      { $match: { businessId: new mongoose.Types.ObjectId(businessId) } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    res.json({
      totalCalls,
      missedCalls,
      avgDuration: totalCalls > 0 ? (totalDuration[0]?.total || 0) / totalCalls : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call stats', error });
  }
});

export default router;
