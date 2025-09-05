import Anthropic from '@anthropic-ai/sdk';
import type { ConversationContext } from './types';

export class ReceptionistPolicy {
  private anthropic: Anthropic;
  private systemPrompt: string;
  
  constructor(apiKey: string, businessName: string) {
    this.anthropic = new Anthropic({ apiKey });
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
      ...context.conversationHistory,
      { role: 'user' as const, content: userInput }
    ];
    
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 150,
      system: `${this.systemPrompt}\n\nKnowledge Base:\n${knowledgeContext}`,
      messages
    });
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
  }
}