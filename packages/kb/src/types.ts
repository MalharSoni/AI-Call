export interface Snippet {
  text: string;
  url: string;
  score: number;
}

export interface AgentCard {
  businessId: string;
  businessName: string;
  brandVoice: string;
  hours: Record<string, string>;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  services: string[];
  policies: string[];
}

export interface FAQ {
  id: string;
  businessId: string;
  question: string;
  answer: string;
  sourceUrl: string;
}