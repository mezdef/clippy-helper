import type { MessageRole } from './data';

// AI Response Types
export interface ListItem {
  title: string;
  content: string;
}

export interface AdviceList {
  title: string;
  list: ListItem[];
}

// Type for AI response that matches what OpenAI returns
export interface AiResponse {
  output_parsed: AdviceList;
  /** Allow for other OpenAI response properties */
  [key: string]: unknown;
}

// Type for message data when creating messages
export interface MessageCreateData {
  role: MessageRole;
  content: string;
  aiResponse?: AdviceList;
}

// Type for excerpt data
export interface ExcerptData {
  id: string;
  title: string;
  content: string;
  order: string;
}
