import { EventEmitter } from 'events';
import * as sdk from 'azure-cognitiveservices-speech-sdk';

export class STTAdapter extends EventEmitter {
  private pushStream: sdk.PushAudioInputStream;
  private recognizer: sdk.SpeechRecognizer;
  
  constructor() {
    super();
    
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY || '',
      process.env.AZURE_SPEECH_REGION || 'eastus'
    );
    
    this.pushStream = sdk.AudioInputStream.createPushStream();
    const audioConfig = sdk.AudioConfig.fromStreamInput(this.pushStream);
    
    this.recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    
    this.recognizer.recognizing = (s, e) => {
      if (e.result.text) {
        this.emit('partial', e.result.text);
      }
    };
    
    this.recognizer.recognized = (s, e) => {
      if (e.result.text) {
        this.emit('transcript', e.result.text);
      }
    };
    
    this.recognizer.startContinuousRecognitionAsync();
  }
  
  processAudio(audioBuffer: Buffer) {
    this.pushStream.write(audioBuffer);
  }
  
  stop() {
    this.recognizer.stopContinuousRecognitionAsync();
    this.pushStream.close();
  }
}