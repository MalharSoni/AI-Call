export type Intent = 'faq' | 'booking' | 'transfer' | 'greeting' | 'unknown';
export interface Tool {
    name: string;
    description: string;
    parameters: Record<string, any>;
}
export interface ConversationContext {
    businessName: string;
    businessId: string;
    callerNumber: string;
    conversationHistory: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    knowledgeSnippets: Array<{
        text: string;
        url: string;
    }>;
}
