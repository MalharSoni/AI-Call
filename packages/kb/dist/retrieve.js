"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKnowledgeBase = searchKnowledgeBase;
const supabase_js_1 = require("@supabase/supabase-js");
const embeddings_1 = require("./embeddings");
async function searchKnowledgeBase(query, businessId, supabaseUrl, supabaseKey, cohereKey) {
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    // Generate embedding for the query
    const queryEmbedding = await (0, embeddings_1.generateEmbedding)(query, cohereKey);
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
    return data.map((item) => ({
        text: item.text,
        url: item.url,
        score: item.similarity
    }));
}
