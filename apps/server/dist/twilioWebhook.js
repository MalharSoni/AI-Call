"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTwilioRoutes = setupTwilioRoutes;
const telephony_1 = require("@ai-call/telephony");
function setupTwilioRoutes(app) {
    // Incoming call webhook
    app.post('/voice/incoming', (req, res) => {
        const { CallSid, From } = req.body;
        const wsUrl = `wss://${req.headers.host}/voice-stream`;
        const twiml = (0, telephony_1.handleIncomingCall)(CallSid, From, wsUrl);
        res.type('text/xml');
        res.send(twiml);
    });
    // Transfer webhook
    app.post('/voice/transfer', (req, res) => {
        const { CallSid } = req.body;
        const { toNumber, whisper } = req.query;
        const twiml = (0, telephony_1.warmTransfer)(CallSid, toNumber, whisper, process.env.TWILIO_VOICE_NUMBER || '', `https://${req.headers.host}/voice/whisper`);
        res.type('text/xml');
        res.send(twiml);
    });
    // Whisper webhook
    app.post('/voice/whisper', (req, res) => {
        const { summary } = req.query;
        const twiml = (0, telephony_1.generateWhisper)(summary);
        res.type('text/xml');
        res.send(twiml);
    });
}
