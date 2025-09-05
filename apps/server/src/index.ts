import express from 'express';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { setupTwilioRoutes } from './twilioWebhook';
import { handleWebSocketConnection } from './wsStream';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Twilio webhook routes
setupTwilioRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// WebSocket server for Twilio media streams
const wss = new WebSocketServer({ server, path: '/voice-stream' });

wss.on('connection', (ws) => {
  handleWebSocketConnection(ws);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
  });
});