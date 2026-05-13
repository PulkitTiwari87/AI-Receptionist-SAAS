import Retell from 'retell-sdk';

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

export const createWebCall = async (agentId: string) => {
  try {
    const webCallResponse = await retellClient.call.createWebCall({
      agent_id: agentId,
    });
    return webCallResponse;
  } catch (error) {
    console.error('Error creating Retell web call:', error);
    throw error;
  }
};

export default retellClient;
