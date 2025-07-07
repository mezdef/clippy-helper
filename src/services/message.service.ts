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
import type { AdviceList, ExcerptData, MessageRole } from '@/types';

export interface FormattedMessage {
  id: string;
  role: MessageRole;
  text: string;
  excerpts: ExcerptData[];
}

export const messageService = {
  // Create a new message (optionally with excerpts for AI responses)
  async create(
    data: Omit<NewMessage, 'id' | 'createdAt'> & {
      aiResponse?: AdviceList;
    }
  ): Promise<MessageWithExcerpts> {
    const { aiResponse, ...messageData } = data;

    // Create the message first
    const [message] = await db.insert(messages).values(messageData).returning();

    // Save excerpts if this is an AI response with structured content
    let messageExcerpts: Excerpt[] = [];
    if (aiResponse && messageData.role === 'assistant') {
      // Create excerpts after message creation
      if (
        aiResponse?.list &&
        Array.isArray(aiResponse.list) &&
        aiResponse.list.length > 0
      ) {
        try {
          const excerptData = aiResponse.list.map((item, index) => ({
            messageId: message.id,
            title: item.title,
            content: item.content,
            order: index.toString(),
          }));

          messageExcerpts = await db
            .insert(excerpts)
            .values(excerptData)
            .returning();
        } catch (excerptError) {
          // If excerpt creation fails, log the error but don't fail the entire operation
          // The message will still be created, just without excerpts
          console.error('Failed to create excerpts:', excerptError);
        }
      }
    }

    return {
      ...message,
      excerpts: messageExcerpts,
    };
  },

  // Get messages for a conversation with excerpts
  async getByConversationId(
    conversationId: string
  ): Promise<MessageWithExcerpts[]> {
    const result = await db
      .select({
        message: messages,
        excerpt: excerpts,
      })
      .from(messages)
      .leftJoin(excerpts, eq(messages.id, excerpts.messageId))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt, excerpts.order);

    // Group messages and their excerpts together
    const messageMap = new Map<string, MessageWithExcerpts>();

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
        messageMap.get(messageId)!.excerpts.push(row.excerpt);
      }
    });

    return Array.from(messageMap.values());
  },

  // Format messages for UI consumption
  formatMessagesForUI(messages: MessageWithExcerpts[]): FormattedMessage[] {
    return messages.map(msg => ({
      id: msg.id,
      role: msg.role as MessageRole,
      text: msg.content,
      excerpts: msg.excerpts,
    }));
  },

  // Get a message by ID
  async getById(id: string): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  },

  // Delete a message (cascade deletes are handled by database constraints)
  async delete(id: string): Promise<void> {
    // The database will automatically cascade delete all excerpts for this message
    await db.delete(messages).where(eq(messages.id, id));
  },

  // Update a message
  async update(id: string, data: Partial<NewMessage>): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set(data)
      .where(eq(messages.id, id))
      .returning();
    return message;
  },
};
