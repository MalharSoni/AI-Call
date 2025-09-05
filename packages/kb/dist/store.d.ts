export declare function storeDocument(businessId: string, url: string, text: string, checksum: string, supabaseUrl: string, supabaseKey: string): Promise<string>;
export declare function storeChunk(docId: string, text: string, metadata: Record<string, any>, supabaseUrl: string, supabaseKey: string, cohereKey: string): Promise<void>;
