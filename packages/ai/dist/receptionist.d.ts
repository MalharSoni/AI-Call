import type { ConversationContext } from './types';
export declare class ReceptionistPolicy {
    private openai;
    private systemPrompt;
    constructor(apiKey: string, businessName: string);
    generateResponse(userInput: string, context: ConversationContext): Promise<string>;
}
