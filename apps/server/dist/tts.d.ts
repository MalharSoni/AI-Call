import WebSocket from 'ws';
export declare class TTSAdapter {
    private ws;
    private streamSid;
    constructor(ws: WebSocket, streamSid: string);
    speak(text: string): Promise<void>;
    private fallbackSpeak;
    stop(): void;
}
