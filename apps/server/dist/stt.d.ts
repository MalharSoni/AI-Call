import { EventEmitter } from 'events';
export declare class STTAdapter extends EventEmitter {
    private openai;
    private audioBuffer;
    private isProcessing;
    constructor();
    processAudio(audioBuffer: Buffer): void;
    private processBufferedAudio;
    stop(): void;
}
