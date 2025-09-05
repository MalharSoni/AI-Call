# AI-Call Receptionist System

An AI-powered receptionist that can be set up in under 60 seconds from a business URL. Answers FAQs, texts booking links, and warm-transfers callers to staff.

## Features

- 🚀 <60 second setup from business website URL
- 📞 Real-time voice conversations via Twilio
- 💬 FAQ answering using website content
- 📱 SMS booking links to callers
- 🔄 Warm transfer with context whisper
- ⚡ <700ms conversational latency

## Architecture

TypeScript monorepo structure:
- `/apps/server` - Express server with Twilio webhooks and WebSocket streaming
- `/apps/web` - Next.js configuration UI
- `/apps/ingest` - Web crawler and content processor
- `/packages/telephony` - Twilio voice/SMS utilities
- `/packages/ai` - LLM orchestration and intent routing
- `/packages/kb` - Knowledge base with vector search

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start local database:**
   ```bash
   cd infra && docker-compose up -d
   ```

4. **Run development servers:**
   ```bash
   npm run dev
   ```

5. **Configure Twilio:**
   - Buy a phone number in Twilio console
   - Set webhook URL to `https://your-domain.com/voice/incoming`
   - Configure ngrok for local development

## Environment Variables

Required API keys:
- `TWILIO_ACCOUNT_SID` - Twilio account ID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_VOICE_NUMBER` - Your Twilio phone number
- `ANTHROPIC_API_KEY` - Claude API key
- `AZURE_SPEECH_KEY` - Azure Speech Services key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `COHERE_API_KEY` - Cohere embeddings API key

## Usage

1. Navigate to `http://localhost:3000`
2. Enter business website URL
3. Optionally add booking URL and staff phone
4. Click "Set Up AI Receptionist"
5. Test with the "Test Call" button

## Performance Targets

- Setup time: <60 seconds
- Conversational latency: <700ms
- Website crawl: <15 seconds
- FAQ generation: 10+ questions

## Development

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## License

MIT