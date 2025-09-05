import type { Snippet } from './types';
export declare function searchKnowledgeBase(query: string, businessId: string, supabaseUrl: string, supabaseKey: string, cohereKey: string): Promise<Snippet[]>;
