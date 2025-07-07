import { eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  messages,
  excerpts,
  type NewMessage,
  type Message,
  type Excerpt,
  type MessageWithExcerpts,
} from '@/db/schema';
import type { AdviceList, ExcerptData, MessageRole } from '@/types';

// UI-friendly message format that flattens the database structure
export interface FormattedMessage {
  id: string;
  role: MessageRole;
  text: string;
  excerpts: ExcerptData[];
}

// Message service - handles conversation message storage and AI response processing
export const messageService = {
  // Create a new message, automatically extracting excerpts from AI responses
  async create(
    data: Omit<NewMessage, 'id' | 'createdAt'> & {
      aiResponse?: AdviceList;
    }
  ): Promise<MessageWithExcerpts> {
    const { aiResponse, ...messageData } = data;

    // Create the message first to get its ID for excerpt relationships
    const [message] = await db.insert(messages).values(messageData).returning();

    // Extract and save structured advice as individual excerpts (for AI responses only)
    let messageExcerpts: Excerpt[] = [];
    if (aiResponse && messageData.role === 'assistant') {
      // Process the AI's structured advice list into separate excerpt records
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
          // Don't fail the entire operation if excerpt creation fails
          // The message is still valid without excerpts
          console.error('Failed to create excerpts:', excerptError);
        }
      }
    }

    return {
      ...message,
      excerpts: messageExcerpts,
    };
  },

  // Get conversation messages with their excerpts, maintaining chronological order
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

    // Group excerpts under their parent messages (handles 1-to-many relationship)
    const messageMap = new Map<string, MessageWithExcerpts>();

    result.forEach(row => {
      const messageId = row.message.id;

      if (!messageMap.has(messageId)) {
        messageMap.set(messageId, {
          ...row.message,
          excerpts: [],
        });
      }

      // Add excerpt if it exists (left join can return null excerpts)
      if (row.excerpt) {
        messageMap.get(messageId)!.excerpts.push(row.excerpt);
      }
    });

    return Array.from(messageMap.values());
  },

  // Transform database format to UI format for React components
  formatMessagesForUI(messages: MessageWithExcerpts[]): FormattedMessage[] {
    return messages.map(msg => ({
      id: msg.id,
      role: msg.role as MessageRole,
      text: msg.content, // Map 'content' field to 'text' for UI consistency
      excerpts: msg.excerpts,
    }));
  },

  // Single message lookup (used for editing and validation)
  async getById(id: string): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  },

  // Delete message and all related excerpts (foreign key cascade handles cleanup)
  async delete(id: string): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  },

  // Update message content (typically used for editing user messages)
  async update(id: string, data: Partial<NewMessage>): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set(data)
      .where(eq(messages.id, id))
      .returning();
    return message;
  },
};
