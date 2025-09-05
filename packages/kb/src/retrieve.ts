import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from './embeddings';
import type { Snippet } from './types';

export async function searchKnowledgeBase(
  query: string,
  businessId: string,
  supabaseUrl: string,
  supabaseKey: string,
  cohereKey: string
): Promise<Snippet[]> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query, cohereKey);
  
  // Search using pgvector
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    business_id: businessId,
    match_threshold: 0.7,
    match_count: 5
  });
  
  if (error) {
    console.error('Search error:', error);
    return [];
  }
  
  return data.map((item: any) => ({
    text: item.text,
    url: item.url,
    score: item.similarity
  }));
}