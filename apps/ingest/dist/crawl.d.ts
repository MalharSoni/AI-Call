import type { AgentCard } from '@ai-call/kb';
interface CrawlResult {
    url: string;
    text: string;
    checksum: string;
}
export declare function crawlWebsite(url: string, depth?: number): Promise<{
    agentCard: AgentCard;
    pages: CrawlResult[];
}>;
export {};
