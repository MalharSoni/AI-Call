import WebSocket from 'ws';

export class TTSAdapter {
  private ws: WebSocket;
  private streamSid: string;
  
  constructor(ws: WebSocket, streamSid: string) {
    this.ws = ws;
    this.streamSid = streamSid;
  }
  
  async speak(text: string): Promise<void> {
    // Simplified TTS - would use ElevenLabs in production
    // For now, using Twilio's <Say> as fallback
    const message = {
      event: 'media',
      streamSid: this.streamSid,
      media: {
        payload: Buffer.from(text).toString('base64')
      }
    };
    
    this.ws.send(JSON.stringify(message));
  }
  
  stop() {
    // Stop any ongoing TTS
  }
}