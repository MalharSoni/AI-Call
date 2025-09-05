import { CohereClient } from 'cohere-ai';

export async function generateEmbedding(
  text: string,
  apiKey: string
): Promise<number[]> {
  const cohere = new CohereClient({ token: apiKey });
  
  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_query'
  });
  
  return response.embeddings[0];
}