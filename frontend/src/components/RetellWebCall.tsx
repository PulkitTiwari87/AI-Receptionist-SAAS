import React, { useState, useEffect } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Phone, PhoneOff, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const retellWebClient = new RetellWebClient();

const RetellWebCall: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    // Handle call end events
    retellWebClient.on('call_ended', () => {
      setIsCalling(false);
    });

    retellWebClient.on('error', (error) => {
      console.error('Retell Web Call Error:', error);
      setIsCalling(false);
    });

    return () => {
      retellWebClient.off('call_ended');
      retellWebClient.off('error');
    };
  }, []);

  const toggleCall = async () => {
    if (isCalling) {
      retellWebClient.stopCall();
      setIsCalling(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Get access token from our backend
      const response = await api.post('/api/retell/create-web-call', {}, token!);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to start call');

      // 2. Start the call using the access token (call_id/access_token from Retell)
      await retellWebClient.startCall({
        accessToken: data.access_token,
      });

      setIsCalling(true);
    } catch (error) {
      console.error('Failed to start web call:', error);
      alert('Error starting call. Make sure you have configured your Retell Agent ID.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleCall}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
        isCalling 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isCalling ? (
        <PhoneOff className="w-5 h-5" />
      ) : (
        <Phone className="w-5 h-5" />
      )}
      {isCalling ? 'End Call' : 'Test AI Receptionist'}
    </button>
  );
};

export default RetellWebCall;
