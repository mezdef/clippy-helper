import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { OPENAI_CONFIG, ERROR_MESSAGES } from '@/constants';
import { env } from '@/lib/env';
import type { FormattedMessage } from './message.service';

// Schema for structured AI advice - ensures consistent output format
const ListItem = z.object({
  title: z.string(),
  content: z.string(),
});

const AdviceList = z.object({
  title: z.string(),
  list: z.array(ListItem),
});

export type ListItemType = z.infer<typeof ListItem>;
export type AdviceListType = z.infer<typeof AdviceList>;

// OpenAI API request format - simplified conversation structure
export interface AiRequestInput {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// OpenAI structured response - guarantees parseable advice format
export interface AiResponseStructured {
  output_parsed: AdviceListType;
}

// OpenAI client instance (server-side only - API key required)
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

// LLM service - manages AI conversation processing and response structuring
export const llmService = {
  // Generate structured AI advice from conversation context
  async generateResponse(
    messages: AiRequestInput[]
  ): Promise<AiResponseStructured> {
    try {
      if (!messages || messages.length === 0) {
        throw new Error(ERROR_MESSAGES.NO_MESSAGES_FOR_AI);
      }

      const lastMessage = messages[messages.length - 1];
      if (typeof lastMessage.content !== 'string') {
        throw new Error(ERROR_MESSAGES.INVALID_MESSAGE_FORMAT);
      }

      // Use OpenAI's structured output to guarantee parseable advice format
      const response = await openai.responses.parse({
        model: OPENAI_CONFIG.DEFAULT_MODEL,
        input: [
          { role: 'system', content: OPENAI_CONFIG.ADVICE_SYSTEM_PROMPT },
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

  // Extract user messages for AI context (filters out assistant responses to avoid confusion)
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

  // Create complete conversation payload including historical context and new message
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
