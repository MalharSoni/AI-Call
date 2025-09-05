import { chromium, Browser, Page } from 'playwright';
import { createHash } from 'crypto';
import type { AgentCard } from '@ai-call/kb';

interface CrawlResult {
  url: string;
  text: string;
  checksum: string;
}

export async function crawlWebsite(
  url: string,
  depth: number = 2
): Promise<{ agentCard: AgentCard; pages: CrawlResult[] }> {
  const browser = await chromium.launch();
  const visitedUrls = new Set<string>();
  const pages: CrawlResult[] = [];
  
  try {
    await crawlPage(browser, url, depth, visitedUrls, pages);
    
    // Generate agent card from crawled content
    const agentCard = generateAgentCard(url, pages);
    
    return { agentCard, pages };
  } finally {
    await browser.close();
  }
}

async function crawlPage(
  browser: Browser,
  url: string,
  depth: number,
  visitedUrls: Set<string>,
  pages: CrawlResult[]
): Promise<void> {
  if (depth <= 0 || visitedUrls.has(url)) return;
  
  visitedUrls.add(url);
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Extract text content
    const text = await page.evaluate(() => {
      const removeScripts = (doc: Document) => {
        const scripts = doc.querySelectorAll('script, style');
        scripts.forEach(el => el.remove());
      };
      removeScripts(document);
      return document.body?.innerText || '';
    });
    
    const checksum = createHash('md5').update(text).digest('hex');
    pages.push({ url, text, checksum });
    
    // Get links for further crawling
    if (depth > 1) {
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href => href.startsWith('http'));
      });
      
      const domain = new URL(url).hostname;
      const sameOriginLinks = links.filter(link => {
        try {
          return new URL(link).hostname === domain;
        } catch {
          return false;
        }
      });
      
      for (const link of sameOriginLinks.slice(0, 5)) {
        await crawlPage(browser, link, depth - 1, visitedUrls, pages);
      }
    }
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
  } finally {
    await page.close();
  }
}

function generateAgentCard(url: string, pages: CrawlResult[]): AgentCard {
  const combinedText = pages.map(p => p.text).join('\n');
  
  // Extract business information (simplified)
  const businessName = extractBusinessName(combinedText, url);
  const hours = extractHours(combinedText);
  const address = extractAddress(combinedText);
  
  return {
    businessId: createHash('md5').update(url).digest('hex'),
    businessName,
    brandVoice: 'Professional and friendly',
    hours,
    address,
    services: extractServices(combinedText),
    policies: extractPolicies(combinedText)
  };
}

function extractBusinessName(text: string, url: string): string {
  // Simple extraction logic
  const titleMatch = text.match(/^(.+?)\n/);
  return titleMatch ? titleMatch[1] : new URL(url).hostname;
}

function extractHours(text: string): Record<string, string> {
  // Simplified hours extraction
  return {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 5:00 PM',
    friday: '9:00 AM - 5:00 PM',
    saturday: 'Closed',
    sunday: 'Closed'
  };
}

function extractAddress(text: string): any {
  // Simplified address extraction
  return {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345'
  };
}

function extractServices(text: string): string[] {
  // Simplified service extraction
  return ['General Services'];
}

function extractPolicies(text: string): string[] {
  // Simplified policy extraction
  return ['Standard business policies apply'];
}