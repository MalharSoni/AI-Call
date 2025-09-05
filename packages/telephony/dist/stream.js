"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebSocketStream = handleWebSocketStream;
function handleWebSocketStream(ws, businessId) {
    let streamSid;
    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        switch (message.event) {
            case 'connected':
                console.log('WebSocket connected');
                break;
            case 'start':
                streamSid = message.streamSid || '';
                console.log('Stream started:', streamSid);
                break;
            case 'media':
                if (message.media?.payload) {
                    // Audio data will be processed by the server
                    // This is just the handler structure
                }
                break;
            case 'stop':
                console.log('Stream stopped');
                break;
        }
    });
    ws.on('close', () => {
        console.log('WebSocket closed');
    });
}
