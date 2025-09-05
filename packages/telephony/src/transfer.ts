import twilio from 'twilio';

interface TransferStatus {
  success: boolean;
  error?: string;
}

export function warmTransfer(
  callSid: string, 
  toNumber: string, 
  whisper: string,
  twilioNumber: string,
  whisperUrl: string
): string {
  const twiml = new twilio.twiml.VoiceResponse();
  
  const dial = twiml.dial({ callerId: twilioNumber });
  dial.number(
    {
      url: `${whisperUrl}?summary=${encodeURIComponent(whisper)}`
    },
    toNumber
  );
  
  return twiml.toString();
}

export function generateWhisper(summary: string): string {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say(`Incoming transferred call. Context: ${summary}`);
  return twiml.toString();
}