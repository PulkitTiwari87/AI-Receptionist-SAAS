import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createWebCall } from '../services/retellService';
import Business from '../models/Business';
import CallLog from '../models/CallLog';

const router = express.Router();

// Start a web call for the authenticated business
router.post('/create-web-call', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    const business = await Business.findById(businessId);

    if (!business || !business.retellAgentId) {
      return res.status(400).json({ message: 'Business or Retell Agent ID not found' });
    }

    const callResponse = await createWebCall(business.retellAgentId);
    res.json(callResponse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create web call', error });
  }
});

// Webhook for Retell AI to post call results
// Note: This should be unprotected or use Retell's signature verification
router.post('/webhook', async (req, res) => {
  try {
    const { event, call } = req.body;

    // Retell sends 'call_ended' or similar events
    if (event === 'call_ended' || event === 'call_analyzed') {
      const { 
        call_id, 
        agent_id, 
        transcript, 
        call_analysis, 
        recording_url,
        duration_ms,
        from_number
      } = call;

      // Find the business associated with this agent
      const business = await Business.findOne({ retellAgentId: agent_id });
      if (!business) {
        console.error(`Business not found for Retell Agent ID: ${agent_id}`);
        return res.status(200).send(); // Still return 200 to Retell
      }

      // Create a new call log entry
      const newCallLog = new CallLog({
        businessId: business._id,
        customerPhone: from_number || 'Web Call',
        duration: Math.round(duration_ms / 1000),
        status: 'completed',
        transcript: transcript,
        summary: call_analysis?.call_summary,
        sentiment: call_analysis?.user_sentiment?.toLowerCase(),
        recordingUrl: recording_url,
        actionTaken: call_analysis?.agent_task_completion ? 'Task Completed' : 'Inquiry Handled'
      });

      await newCallLog.save();
      console.log(`Call log saved for call ${call_id}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Retell Webhook Error:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
});

export default router;
