"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebSocketConnection = handleWebSocketConnection;
const ai_1 = require("@ai-call/ai");
const kb_1 = require("@ai-call/kb");
const stt_1 = require("./stt");
const tts_1 = require("./tts");
function handleWebSocketConnection(ws) {
    let state = null;
    ws.on('message', async (data) => {
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
                    sttAdapter: new stt_1.STTAdapter(),
                    ttsAdapter: new tts_1.TTSAdapter(ws, message.streamSid),
                    receptionistPolicy: new ai_1.ReceptionistPolicy(process.env.OPENAI_API_KEY || '', 'AI Receptionist')
                };
                // Start listening for audio
                state.sttAdapter.on('transcript', async (text) => {
                    await handleUserInput(text, state);
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
async function handleUserInput(userInput, state) {
    const startTime = Date.now();
    // Detect intent
    const intent = (0, ai_1.detectIntent)(userInput);
    // Search knowledge base if needed
    let snippets = [];
    if (intent === 'faq') {
        snippets = await (0, kb_1.searchKnowledgeBase)(userInput, 'default-business', process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '', process.env.COHERE_API_KEY || '');
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
    state.conversationHistory.push({ role: 'user', content: userInput }, { role: 'assistant', content: response });
    // Convert response to speech and stream back
    await state.ttsAdapter.speak(response);
    const latency = Date.now() - startTime;
    console.log(`Response latency: ${latency}ms`);
}
