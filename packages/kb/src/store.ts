import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from './embeddings';

export async function storeDocument(
  businessId: string,
  url: string,
  text: string,
  checksum: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<string> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('doc')
    .insert({
      business_id: businessId,
      url,
      text,
      checksum
    })
    .select('id')
    .single();
  
  if (error) throw error;
  return data.id;
}

export async function storeChunk(
  docId: string,
  text: string,
  metadata: Record<string, any>,
  supabaseUrl: string,
  supabaseKey: string,
  cohereKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const embedding = await generateEmbedding(text, cohereKey);
  
  await supabase
    .from('chunk')
    .insert({
      doc_id: docId,
      embedding,
      meta_json: metadata
    });
}