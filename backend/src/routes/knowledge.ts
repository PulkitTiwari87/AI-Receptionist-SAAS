import express from 'express';
import Knowledge from '../models/Knowledge';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all knowledge base items for a business
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const knowledge = await Knowledge.find({ businessId }).sort({ createdAt: -1 });
    res.json(knowledge);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching knowledge base', error });
  }
});

// Create a new knowledge item
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const newKnowledge = new Knowledge({
      ...req.body,
      businessId
    });

    await newKnowledge.save();
    res.status(201).json(newKnowledge);
  } catch (error) {
    res.status(500).json({ message: 'Error creating knowledge item', error });
  }
});

// Update a knowledge item
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const knowledge = await Knowledge.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user?.businessId },
      req.body,
      { new: true }
    );

    if (!knowledge) return res.status(404).json({ message: 'Knowledge item not found' });
    res.json(knowledge);
  } catch (error) {
    res.status(500).json({ message: 'Error updating knowledge item', error });
  }
});

// Delete a knowledge item
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const knowledge = await Knowledge.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user?.businessId
    });

    if (!knowledge) return res.status(404).json({ message: 'Knowledge item not found' });
    res.json({ message: 'Knowledge item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting knowledge item', error });
  }
});

export default router;
