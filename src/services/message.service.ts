import { db } from '@/db';
import {
  messages,
  excerpts,
  type NewMessage,
  type Message,
  type Excerpt,
  type MessageWithExcerpts,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { excerptService } from './excerpt.service';

export interface FormattedMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  excerpts: Array<{
    id: string;
    title: string;
    content: string;
    order: string;
  }>;
}

export const messageService = {
  // Create a new message (optionally with excerpts for AI responses)
  async create(
    data: Omit<NewMessage, 'id' | 'createdAt'> & {
      aiResponse?: any;
    }
  ): Promise<MessageWithExcerpts> {
    const { aiResponse, ...messageData } = data;
    const [message] = await db.insert(messages).values(messageData).returning();

    // Save excerpts if this is an AI response with structured content
    let messageExcerpts: Excerpt[] = [];
    if (aiResponse && messageData.role === 'assistant') {
      messageExcerpts = await excerptService.saveFromAiResponse(
        message.id,
        aiResponse
      );
    }

    return {
      ...message,
      excerpts: messageExcerpts,
    };
  },

  // Get messages for a conversation with excerpts
  async getByConversationId(conversationId: string) {
    const result = await db
      .select({
        message: messages,
        excerpt: excerpts,
      })
      .from(messages)
      .leftJoin(excerpts, eq(messages.id, excerpts.messageId))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt, excerpts.order);

    // Group messages and their excerpts
    const messageMap = new Map();

    result.forEach(row => {
      const messageId = row.message.id;

      if (!messageMap.has(messageId)) {
        messageMap.set(messageId, {
          ...row.message,
          excerpts: [],
        });
      }

      // Add excerpt if it exists
      if (row.excerpt) {
        messageMap.get(messageId).excerpts.push(row.excerpt);
      }
    });

    return Array.from(messageMap.values());
  },

  // Format messages for UI consumption
  formatMessagesForUI(messages: MessageWithExcerpts[]): FormattedMessage[] {
    return messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      text: msg.content,
      excerpts: msg.excerpts,
    }));
  },

  // Get a message by ID
  async getById(id: string) {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  },

  // Delete a message
  async delete(id: string) {
    await db.delete(messages).where(eq(messages.id, id));
  },

  // Update a message
  async update(id: string, data: Partial<NewMessage>) {
    const [message] = await db
      .update(messages)
      .set(data)
      .where(eq(messages.id, id))
      .returning();
    return message;
  },
};
