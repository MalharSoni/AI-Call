import WebSocket from 'ws';
import { ReceptionistPolicy, detectIntent } from '@ai-call/ai';
import { searchKnowledgeBase } from '@ai-call/kb';
import { STTAdapter } from './stt';
import { TTSAdapter } from './tts';

interface StreamState {
  streamSid: string;
  callSid: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  sttAdapter: STTAdapter;
  ttsAdapter: TTSAdapter;
  receptionistPolicy: ReceptionistPolicy;
}

export function handleWebSocketConnection(ws: WebSocket) {
  let state: StreamState | null = null;
  
  ws.on('message', async (data: Buffer) => {
    const message = JSON.parse(data.toString());
    
    switch (message.event) {
      case 'connected':
        console.log('Twilio WebSocket connected');
        break;
        
      case 'start':
        state = {
          streamSid: message.streamSid,
          callSid: message.start.callSid,
          conversationHistory: [],
          sttAdapter: new STTAdapter(),
          ttsAdapter: new TTSAdapter(ws, message.streamSid),
          receptionistPolicy: new ReceptionistPolicy(
            process.env.ANTHROPIC_API_KEY || '',
            'AI Receptionist'
          )
        };
        
        // Start listening for audio
        state.sttAdapter.on('transcript', async (text: string) => {
          await handleUserInput(text, state!);
        });
        break;
        
      case 'media':
        if (state && message.media?.payload) {
          // Process incoming audio through STT
          const audioBuffer = Buffer.from(message.media.payload, 'base64');
          state.sttAdapter.processAudio(audioBuffer);
        }
        break;
        
      case 'stop':
        if (state) {
          state.sttAdapter.stop();
          state.ttsAdapter.stop();
        }
        console.log('Stream stopped');
        break;
    }
  });
  
  ws.on('close', () => {
    if (state) {
      state.sttAdapter.stop();
      state.ttsAdapter.stop();
    }
    console.log('WebSocket closed');
  });
}

async function handleUserInput(userInput: string, state: StreamState) {
  const startTime = Date.now();
  
  // Detect intent
  const intent = detectIntent(userInput);
  
  // Search knowledge base if needed
  let snippets: any[] = [];
  if (intent === 'faq') {
    snippets = await searchKnowledgeBase(
      userInput,
      'default-business',
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || '',
      process.env.COHERE_API_KEY || ''
    );
  }
  
  // Generate response
  const response = await state.receptionistPolicy.generateResponse(userInput, {
    businessName: 'Demo Business',
    businessId: 'default-business',
    callerNumber: '+1234567890',
    conversationHistory: state.conversationHistory,
    knowledgeSnippets: snippets
  });
  
  // Update conversation history
  state.conversationHistory.push(
    { role: 'user', content: userInput },
    { role: 'assistant', content: response }
  );
  
  // Convert response to speech and stream back
  await state.ttsAdapter.speak(response);
  
  const latency = Date.now() - startTime;
  console.log(`Response latency: ${latency}ms`);
}