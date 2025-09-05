import OpenAI from 'openai';
import type { ConversationContext } from './types';

export class ReceptionistPolicy {
  private openai: OpenAI;
  private systemPrompt: string;
  
  constructor(apiKey: string, businessName: string) {
    this.openai = new OpenAI({ apiKey });
    this.systemPrompt = `You are Receptionist-Pro for ${businessName}.
Use only the provided knowledge base snippets with source URLs.
If unsure, say you can text the official link or transfer to staff.
Keep answers ≤2 short sentences; then offer SMS or transfer.
NEVER invent prices/medical advice; confirm hours and address.
Tools: search_kb(query), send_sms(number,text), transfer(reason).`;
  }
  
  async generateResponse(
    userInput: string,
    context: ConversationContext
  ): Promise<string> {
    const knowledgeContext = context.knowledgeSnippets
      .map(s => `[Source: ${s.url}]\n${s.text}`)
      .join('\n\n');
    
    const messages = [
      { role: 'system' as const, content: `${this.systemPrompt}\n\nKnowledge Base:\n${knowledgeContext}` },
      ...context.conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: msg.content
      })),
      { role: 'user' as const, content: userInput }
    ];
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      max_tokens: 150,
      messages
    });
    
    return response.choices[0]?.message?.content || '';
  }
}