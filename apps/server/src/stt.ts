import { EventEmitter } from 'events';
import OpenAI from 'openai';

export class STTAdapter extends EventEmitter {
  private openai: OpenAI;
  private audioBuffer: Buffer[] = [];
  private isProcessing = false;
  
  constructor() {
    super();
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });
  }
  
  processAudio(audioBuffer: Buffer) {
    this.audioBuffer.push(audioBuffer);
    
    // Process audio in chunks to maintain low latency
    if (!this.isProcessing && this.audioBuffer.length > 0) {
      this.processBufferedAudio();
    }
  }
  
  private async processBufferedAudio() {
    if (this.audioBuffer.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      // Combine buffered audio
      const combinedBuffer = Buffer.concat(this.audioBuffer);
      this.audioBuffer = [];
      
      // Create a temporary file for OpenAI Whisper
      const audioFile = new File([combinedBuffer], 'audio.wav', { type: 'audio/wav' });
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
      });
      
      if (transcription.text) {
        this.emit('transcript', transcription.text);
      }
    } catch (error) {
      console.error('STT error:', error);
    } finally {
      this.isProcessing = false;
      
      // Process any new audio that arrived while processing
      if (this.audioBuffer.length > 0) {
        setTimeout(() => this.processBufferedAudio(), 100);
      }
    }
  }
  
  stop() {
    this.audioBuffer = [];
    this.isProcessing = false;
  }
}