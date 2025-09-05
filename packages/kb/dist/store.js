"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeDocument = storeDocument;
exports.storeChunk = storeChunk;
const supabase_js_1 = require("@supabase/supabase-js");
const embeddings_1 = require("./embeddings");
async function storeDocument(businessId, url, text, checksum, supabaseUrl, supabaseKey) {
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
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
    if (error)
        throw error;
    return data.id;
}
async function storeChunk(docId, text, metadata, supabaseUrl, supabaseKey, cohereKey) {
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    const embedding = await (0, embeddings_1.generateEmbedding)(text, cohereKey);
    await supabase
        .from('chunk')
        .insert({
        doc_id: docId,
        embedding,
        meta_json: metadata
    });
}
