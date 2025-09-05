import { Express } from 'express';
import { handleIncomingCall, warmTransfer, generateWhisper } from '@ai-call/telephony';

export function setupTwilioRoutes(app: Express) {
  // Incoming call webhook
  app.post('/voice/incoming', (req, res) => {
    const { CallSid, From } = req.body;
    const wsUrl = `wss://${req.headers.host}/voice-stream`;
    
    const twiml = handleIncomingCall(CallSid, From, wsUrl);
    res.type('text/xml');
    res.send(twiml);
  });
  
  // Transfer webhook
  app.post('/voice/transfer', (req, res) => {
    const { CallSid } = req.body;
    const { toNumber, whisper } = req.query;
    
    const twiml = warmTransfer(
      CallSid,
      toNumber as string,
      whisper as string,
      process.env.TWILIO_VOICE_NUMBER || '',
      `https://${req.headers.host}/voice/whisper`
    );
    
    res.type('text/xml');
    res.send(twiml);
  });
  
  // Whisper webhook
  app.post('/voice/whisper', (req, res) => {
    const { summary } = req.query;
    const twiml = generateWhisper(summary as string);
    
    res.type('text/xml');
    res.send(twiml);
  });
}