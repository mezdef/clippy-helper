import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { env } from '@/lib/env';
import type { FormattedMessage } from './message.service';

// Schema definitions
const ListItem = z.object({
  title: z.string(),
  content: z.string(),
});

const AdviceList = z.object({
  title: z.string(),
  list: z.array(ListItem),
});

// Types
export type ListItemType = z.infer<typeof ListItem>;
export type AdviceListType = z.infer<typeof AdviceList>;

export interface AiRequestInput {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiResponseStructured extends OpenAI.Responses.Response {
  output_parsed: AdviceListType;
}

// OpenAI client instance (server-side only)
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const llmService = {
  /**
   * Generate AI response from conversation messages (server-side only)
   */
  async generateResponse(
    messages: AiRequestInput[]
  ): Promise<AiResponseStructured> {
    try {
      if (!messages || messages.length === 0) {
        throw new Error('No messages provided');
      }

      if (typeof messages[messages.length - 1].content !== 'string') {
        throw new Error('Invalid message format');
      }

      const response = await openai.responses.parse({
        model: 'gpt-4o-2024-08-06',
        input: [
          { role: 'system', content: 'Provide advice as an unordered list.' },
          ...messages,
        ],
        text: {
          format: zodTextFormat(AdviceList, 'zod_schema'),
        },
      });

      return response as AiResponseStructured;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  },

  /**
   * Build conversation context from existing messages (utility function)
   */
  buildConversationContext(
    existingMessages: FormattedMessage[]
  ): AiRequestInput[] {
    return existingMessages
      .filter(msg => msg.role === 'user')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.text || '',
      }));
  },

  /**
   * Create a complete conversation request with new user message (utility function)
   */
  createConversationRequest(
    existingMessages: FormattedMessage[],
    newUserMessage: string
  ): AiRequestInput[] {
    const conversationContext = this.buildConversationContext(existingMessages);

    return [
      ...conversationContext,
      {
        role: 'user',
        content: newUserMessage,
      },
    ];
  },
};
