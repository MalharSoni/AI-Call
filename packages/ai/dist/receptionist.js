"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptionistPolicy = void 0;
const openai_1 = __importDefault(require("openai"));
class ReceptionistPolicy {
    openai;
    systemPrompt;
    constructor(apiKey, businessName) {
        this.openai = new openai_1.default({ apiKey });
        this.systemPrompt = `You are Receptionist-Pro for ${businessName}.
Use only the provided knowledge base snippets with source URLs.
If unsure, say you can text the official link or transfer to staff.
Keep answers ≤2 short sentences; then offer SMS or transfer.
NEVER invent prices/medical advice; confirm hours and address.
Tools: search_kb(query), send_sms(number,text), transfer(reason).`;
    }
    async generateResponse(userInput, context) {
        const knowledgeContext = context.knowledgeSnippets
            .map(s => `[Source: ${s.url}]\n${s.text}`)
            .join('\n\n');
        const messages = [
            { role: 'system', content: `${this.systemPrompt}\n\nKnowledge Base:\n${knowledgeContext}` },
            ...context.conversationHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: userInput }
        ];
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            max_tokens: 150,
            messages
        });
        return response.choices[0]?.message?.content || '';
    }
}
exports.ReceptionistPolicy = ReceptionistPolicy;
