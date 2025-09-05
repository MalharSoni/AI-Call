"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STTAdapter = void 0;
const events_1 = require("events");
const openai_1 = __importDefault(require("openai"));
class STTAdapter extends events_1.EventEmitter {
    openai;
    audioBuffer = [];
    isProcessing = false;
    constructor() {
        super();
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || ''
        });
    }
    processAudio(audioBuffer) {
        this.audioBuffer.push(audioBuffer);
        // Process audio in chunks to maintain low latency
        if (!this.isProcessing && this.audioBuffer.length > 0) {
            this.processBufferedAudio();
        }
    }
    async processBufferedAudio() {
        if (this.audioBuffer.length === 0)
            return;
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
        }
        catch (error) {
            console.error('STT error:', error);
        }
        finally {
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
exports.STTAdapter = STTAdapter;
