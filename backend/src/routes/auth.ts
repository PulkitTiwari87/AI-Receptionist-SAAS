import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Business from '../models/Business';

const router = express.Router();

// Mock registration for Phase 1
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, businessName, industry } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create Business Tenant
    const business = new Business({
      name: businessName || `${firstName}'s Business`,
      industry: industry || 'Other'
    });
    await business.save();

    // Create User
    const user = new User({
      email,
      passwordHash: password, // In production, use bcrypt!
      firstName,
      lastName,
      role: 'BUSINESS_OWNER',
      businessId: business._id
    });
    await user.save();

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, businessId: user.businessId },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user, business });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Mock login for Phase 1
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // In production, compare hashed password!
    if (user.passwordHash !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, businessId: user.businessId },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
