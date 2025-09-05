import WebSocket from 'ws';

interface StreamMessage {
  event: string;
  streamSid?: string;
  media?: {
    payload: string;
  };
}

export function handleWebSocketStream(ws: WebSocket, businessId: string): void {
  let streamSid: string;
  
  ws.on('message', (data: Buffer) => {
    const message: StreamMessage = JSON.parse(data.toString());
    
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