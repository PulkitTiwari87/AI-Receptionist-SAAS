import express from 'express';
import Appointment from '../models/Appointment';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all appointments for a business
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const appointments = await Appointment.find({ businessId }).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Create a new appointment
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const newAppointment = new Appointment({
      ...req.body,
      businessId
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
});

// Update appointment status
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user?.businessId },
      { status },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
});

// Delete an appointment
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user?.businessId
    });

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
});

export default router;
