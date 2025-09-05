import twilio from 'twilio';

export function handleIncomingCall(callSid: string, from: string, wsUrl: string): string {
  const twiml = new twilio.twiml.VoiceResponse();
  
  const start = twiml.start();
  start.stream({
    url: wsUrl,
    track: 'inbound_track'
  });
  
  twiml.say('Connecting you to our assistant.');
  
  return twiml.toString();
}