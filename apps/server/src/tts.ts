import WebSocket from 'ws';

export class TTSAdapter {
  private ws: WebSocket;
  private streamSid: string;
  
  constructor(ws: WebSocket, streamSid: string) {
    this.ws = ws;
    this.streamSid = streamSid;
  }
  
  async speak(text: string): Promise<void> {
    try {
      // Use ElevenLabs TTS
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');
        
        const message = {
          event: 'media',
          streamSid: this.streamSid,
          media: {
            payload: audioBase64
          }
        };
        
        this.ws.send(JSON.stringify(message));
      } else {
        console.error('ElevenLabs TTS error:', response.statusText);
        // Fallback to simple text echo
        this.fallbackSpeak(text);
      }
    } catch (error) {
      console.error('TTS error:', error);
      this.fallbackSpeak(text);
    }
  }
  
  private fallbackSpeak(text: string) {
    // Fallback: send text as base64 (Twilio will handle TTS)
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