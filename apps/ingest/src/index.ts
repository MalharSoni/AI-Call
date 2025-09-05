import { crawlWebsite } from './crawl';
import { storeDocument, storeChunk } from '@ai-call/kb';

async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.error('Usage: npm start <url>');
    process.exit(1);
  }
  
  console.log(`Crawling ${url}...`);
  const startTime = Date.now();
  
  try {
    const { agentCard, pages } = await crawlWebsite(url, 2);
    
    const elapsed = Date.now() - startTime;
    console.log(`Crawled ${pages.length} pages in ${elapsed}ms`);
    console.log('Agent Card:', agentCard);
    
    // Store in database (would need env vars in production)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE) {
      for (const page of pages) {
        const docId = await storeDocument(
          agentCard.businessId,
          page.url,
          page.text,
          page.checksum,
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE
        );
        
        // Store chunks for RAG
        const chunks = page.text.split('\n\n').filter(c => c.length > 50);
        for (const chunk of chunks) {
          await storeChunk(
            docId,
            chunk,
            { url: page.url },
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE,
            process.env.COHERE_API_KEY || ''
          );
        }
      }
    }
  } catch (error) {
    console.error('Crawl failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}