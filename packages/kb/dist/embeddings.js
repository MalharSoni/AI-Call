"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
const cohere_ai_1 = require("cohere-ai");
async function generateEmbedding(text, apiKey) {
    const cohere = new cohere_ai_1.CohereClient({ token: apiKey });
    const response = await cohere.embed({
        texts: [text],
        model: 'embed-english-v3.0',
        inputType: 'search_query'
    });
    const embeddings = response.embeddings;
    if (Array.isArray(embeddings) && embeddings.length > 0) {
        return embeddings[0];
    }
    throw new Error('No embeddings returned from Cohere API');
}
