# AI Receptionist (No‑Booking MVP) — PRD for Claude Code + MCP

## 0) One‑liner

Spin up a business‑specific AI receptionist in under 60 seconds from just a URL, answer FAQs, text booking/directions links, and warm‑transfer live callers to the business phone. No calendar/EMR integration.

---

## 1) Goals & Non‑Goals

**Goals**

* Walk‑up demo: paste business URL → crawl → create Agent Card → place a live phone call via Twilio → answer 3 FAQs → offer **SMS booking link** or **warm transfer**.
* 5‑minute onboarding for real customers: buy Twilio number, set business website, set booking URL, set staff phone.
* Sub‑700 ms conversational latency (streaming STT/LLM/TTS pipeline with barge‑in).

**Non‑Goals (MVP)**

* No direct booking/EMR/POS integrations.
* No payments.
* No multi‑agent orchestration beyond receptionist.

---

## 2) User Stories

* **Owner (prospect) demo**: “Show me this with *my* business.” → Paste URL → Call starts → Agent answers hours, parking, price range → Offers: “Text you the booking link, or transfer to staff?” → Owner hears warm whisper when transferred.
* **Staff**: “Reduce spam and repetitive questions; only pick up high‑intent calls with context.”
* **Caller**: “Get quick, correct answers; either get a texted link or instantly speak to a person.”

---

## 3) Core Flows

### 3.1 Ingest → Agent Card

1. Input: Business URL (required), optional booking URL, optional staff phone.
2. Crawl site (depth 2), extract clean text.
3. Summarize to **Agent Card** (brand voice, hours, address, services, policies) + **FAQ set**.
4. Store in Supabase; embed chunks for RAG.

### 3.2 Call Routing (Option A — Twilio first)

**Public-facing number is a Twilio DID** → AI receptionist answers → if needed, **<Dial> warm‑transfer** to the business’s *regular* phone number; callee gets whisper context.

```
Caller → Twilio DID → [<Start><Stream> to WS]
        ↘ (AI handles FAQ / offer SMS / offer Transfer)
          ↘ if transfer: <Dial business_number with whisper>
```

### 3.3 Booking Intent (No Booking Integration)

* Agent detects booking intent and **offers**:

  * “I can **text you the official booking link** now,” *or*
  * “I can **transfer you to staff**.”
* If no staff phone configured, only SMS option.

### 3.4 SMS

* Send SMS with booking link, address, directions (Google/Apple Maps), and website.

---

## 4) System Architecture

* **Telephony**: Twilio Programmable Voice + `<Start><Stream>` bidirectional Media Streams.
* **Streaming loop**: WebSocket server receives Twilio audio → STT (Azure/Deepgram) → LLM (Claude Sonnet) → TTS (ElevenLabs Realtime WS) → stream PCM back to Twilio.
* **RAG**: Supabase + pgvector; embeddings (Cohere/Voyage). Retrieval top‑k → passed as context to Claude.
* **Ingestion**: Playwright crawler + Trafilatura HTML to text; robots.txt respect; depth=2.
* **MCP**: Use provided servers (`context7`, `ct-devmcp`) for tools such as scraping, summarization pipelines, secrets, or deployment hooks as available.

---

## 5) Data Model (Supabase)

**tables**

* `business` (id, name, domain, twilio\_number, staff\_phone, booking\_url, address\_json, hours\_json, created\_at)
* `doc` (id, business\_id, url, checksum, text, created\_at)
* `chunk` (id, doc\_id, embedding, meta\_json)
* `faq` (id, business\_id, q, a, source\_url)
* `call_log` (id, business\_id, started\_at, duration\_s, outcome, transcript\_json, sms\_sent\_bool, transferred\_bool, latency\_ms)

**policies**: RLS on `business` by owner account; public demo mode stores only ephemeral data.

---

## 6) Claude Code Setup (MCP + Prompts)

**`claude.code` configuration (given):**

```json
{
  "mcpServers": {
    "context7": { "type": "http", "url": "https://mcp.context7.com/mcp" },
    "ct-devmcp": { "type": "http", "url": "https://devmcp.ct839.com/mcp" }
  }
}
```

Use these MCP tools inside Claude for: crawl/fetch, summarization helpers, secret management, deploy commands, and codegen scaffolds when available.

**System Prompt (Receptionist)**

```
You are Receptionist‑Pro for {{BUSINESS_NAME}}.
Use only the provided knowledge base snippets with source URLs.
If unsure, say you can text the official link or transfer to staff.
Keep answers ≤2 short sentences; then offer SMS or transfer.
NEVER invent prices/medical advice; confirm hours and address.
Tools: search_kb(query), send_sms(number,text), transfer(reason).
```

**Tool Schemas (pseudo)**

* `search_kb(query: string) → { snippets: {text, url}[] }`
* `send_sms(to: string, text: string) → { status }`
* `transfer(reason: string) → { status }`

**Developer Prompt (Claude Code)**

* “Create a TypeScript monorepo per the PRD. Packages: `telephony`, `ai`, `kb`, apps: `server`, `web`, `ingest`. Implement Twilio webhook + WS stream handler, STT adapter (Azure/Deepgram), TTS adapter (ElevenLabs), RAG retriever (Supabase pgvector), and the receptionist policy with booking intent (SMS or transfer). Include env‑checked config and minimal tests.”

---

## 7) Repo Scaffold (TypeScript)

```
/apps
  /server        # Express + Twilio webhooks + WS
  /web           # Next.js settings UI (URL, booking link, staff phone)
  /ingest        # crawler + cleaner + indexer
/packages
  /telephony     # Twilio utils, call state, barge-in
  /ai            # Claude client, policies, intent router, tools
  /kb            # Supabase pg + pgvector, embeddings, RAG
/infra
  docker-compose.yml
  supabase/ (migrations)
  deploy/ (fly.io or render configs)
```

**Key files to generate with Claude**

* `/apps/server/src/twilioWebhook.ts`
* `/apps/server/src/wsStream.ts`
* `/packages/telephony/src/transfer.ts`
* `/packages/ai/src/receptionist.ts`
* `/packages/kb/src/retrieve.ts`
* `/apps/ingest/src/crawl.ts`
* `/apps/web/pages/index.tsx`
* `/infra/supabase/migrations/*.sql`

---

## 8) Twilio Call Flow (Option A)

1. Buy Twilio DID → set Voice Webhook → `/voice/incoming`.
2. TwiML `<Start><Stream>` to `wss://server/voice-stream`.
3. WS handler pumps audio → STT partials → intent policy.
4. Agent replies via ElevenLabs WS; support barge‑in (stop TTS on user speech).
5. On transfer: `<Dial business_regular_number>` with whisper (1–2 sentences).
6. On SMS: send booking URL + directions + website.

**TwiML snippets**

```xml
<Response>
  <Start>
    <Stream url="wss://YOUR_HOST/voice-stream" track="inbound_track" />
  </Start>
  <Say>Connecting you to our assistant.</Say>
</Response>
```

**Transfer**

```xml
<Response>
  <Dial callerId="{{TWILIO_DID}}">
    <Number url="https://YOUR_HOST/whisper?summary={{ENC_SUMMARY}}">{{BUSINESS_NUMBER}}</Number>
  </Dial>
</Response>
```

---

## 9) Latency Budget & Barge‑in

* STT partial: < 200 ms
* LLM first token: < 200 ms (short replies)
* TTS first audio: < 400 ms (streamed)
* Round trip target: < 700 ms
* Barge‑in: cut TTS when partials show speech ≥150 ms; resume after 400 ms silence.

---

## 10) Config & Secrets (.env)

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VOICE_NUMBER=
ELEVENLABS_API_KEY=
STT_PROVIDER=azure|deepgram
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
DEEPGRAM_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
EMBEDDINGS_PROVIDER=cohere|voyage
COHERE_API_KEY=
VOYAGE_API_KEY=
```

---

## 11) Acceptance Criteria (MVP)

* Upload a URL, optional booking URL and staff number.
* Crawl completes ≤ 15s, Agent Card saved, ≥10 FAQs generated.
* Live call completes:

  * Answers 3 FAQs correctly using on‑site content.
  * Offers SMS vs Transfer on booking intent.
  * Successfully sends SMS with booking link.
  * Successfully warm‑transfers with whisper.
* Latency dashboard shows median round‑trip < 700 ms.

---

## 12) Test Plan (Street Demo Script)

1. Create business with Website = local target, Booking URL = their booking page, Staff Phone = their main number.
2. Call flow: “What are today’s hours?” → “Where do I park?” → “How much is a court rental?” (if unknown: offer transfer) → “Text me the booking link” → confirm SMS → “Please transfer me to staff”.
3. Owner phone receives whisper (“caller wants Thursday 7pm slot; asked price range”).

---

## 13) Sprints (7 short days)

* **D1**: Repo + Twilio webhook + WS echo loop.
* **D2**: Ingestion v0 (crawl, clean, chunk, embed, store).
* **D3**: RAG retriever + receptionist policy + intents.
* **D4**: STT adapter + barge‑in + TTS streaming.
* **D5**: Transfer + SMS; call logs + latency metrics.
* **D6**: Web config UI; auth; env checks.
* **D7**: Hardening; demo polish; deploy.

---

## 14) Risk & Mitigation

* **Weird sites / sparse content** → allow manual fields; fall back to transfer.
* **Latency spikes** → keep responses short; prewarm models; regional STT/TTS.
* **Compliance** → announce recording; avoid scraping TOS‑sensitive sources; store attributions.

---

## 15) Claude Code Kickoff Prompts

* **Scaffold**: “Generate the full monorepo per PRD Section 7; create files listed; include package.json, tsconfig, Dockerfile; write minimal unit tests for router.”
* **Twilio**: “Implement `/voice/incoming` TwiML and WS stream handler per Section 8; add barge‑in per Section 9.”
* **Ingest**: “Implement crawler + summarizer that produces Agent Card + ≥10 FAQs from site text.”
* **RAG**: “Add pgvector migrations and retrieval utils; expose `search_kb` tool.”
* **Actions**: “Expose `send_sms` (Twilio) and `transfer` (TwiML Dial with whisper).”
* **UI**: “Simple form to set website, booking URL, staff phone; test call button.”

---

## 16) Owner‑Facing Copy (for the landing/demo)

“**Keep your number.** We give you a new receptionist number that answers instantly, answers common questions, and only forwards high‑intent callers. Prefer online booking? We text callers your official booking link. Need a human? We warm‑transfer with context. Setup in 5 minutes.”
