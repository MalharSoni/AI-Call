-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Business table
CREATE TABLE business (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  twilio_number TEXT,
  staff_phone TEXT,
  booking_url TEXT,
  address_json JSONB,
  hours_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document table
CREATE TABLE doc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  checksum TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chunk table for vector search
CREATE TABLE chunk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id UUID REFERENCES doc(id) ON DELETE CASCADE,
  embedding vector(1024),
  meta_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ table
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business(id) ON DELETE CASCADE,
  q TEXT NOT NULL,
  a TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call log table
CREATE TABLE call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_s INTEGER,
  outcome TEXT,
  transcript_json JSONB,
  sms_sent_bool BOOLEAN DEFAULT FALSE,
  transferred_bool BOOLEAN DEFAULT FALSE,
  latency_ms INTEGER
);

-- Create index for vector similarity search
CREATE INDEX chunk_embedding_idx ON chunk USING ivfflat (embedding vector_cosine_ops);

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1024),
  business_id UUID,
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  doc_id UUID,
  text TEXT,
  url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.doc_id,
    d.text,
    d.url,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM chunk c
  JOIN doc d ON c.doc_id = d.id
  WHERE d.business_id = match_chunks.business_id
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;