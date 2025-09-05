"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
const twilioWebhook_1 = require("./twilioWebhook");
const wsStream_1 = require("./wsStream");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Setup Twilio webhook routes
(0, twilioWebhook_1.setupTwilioRoutes)(app);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// WebSocket server for Twilio media streams
const wss = new ws_1.WebSocketServer({ server, path: '/voice-stream' });
wss.on('connection', (ws) => {
    (0, wsStream_1.handleWebSocketConnection)(ws);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
    });
});
