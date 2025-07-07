import { db } from '@/db';
import {
  conversations,
  messages,
  excerpts,
  type NewConversation,
  type MessageWithExcerpts,
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

interface ConversationWithMessages extends NewConversation {
  messages: MessageWithExcerpts[];
}

export const conversationService = {
  // Create a new conversation
  async create(title: string): Promise<NewConversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({ title })
      .returning();
    return conversation;
  },

  // Get all conversations
  async getAll(): Promise<NewConversation[]> {
    return await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.updatedAt));
  },

  // Get a conversation by ID
  async getById(id: string): Promise<NewConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  },

  // Get a conversation by ID with associated messages and excerpts using joins
  async getByIdWithMessages(
    id: string
  ): Promise<ConversationWithMessages | null> {
    const result = await db
      .select({
        conversation: conversations,
        message: messages,
        excerpt: excerpts,
      })
      .from(conversations)
      .leftJoin(messages, eq(conversations.id, messages.conversationId))
      .leftJoin(excerpts, eq(messages.id, excerpts.messageId))
      .where(eq(conversations.id, id))
      .orderBy(messages.createdAt, excerpts.order);

    if (result.length === 0) {
      return null;
    }

    // Extract conversation data (same for all rows)
    const conversation = result[0].conversation;

    // Group messages and their excerpts
    const messageMap = new Map();

    result.forEach(row => {
      if (row.message) {
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
      }
    });

    const conversationMessages = Array.from(messageMap.values());

    return {
      ...conversation,
      messages: conversationMessages,
    };
  },

  // Update conversation title
  async updateTitle(id: string, title: string): Promise<NewConversation> {
    const [conversation] = await db
      .update(conversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation;
  },

  // Delete a conversation (cascade deletes are handled by database constraints)
  async delete(id: string): Promise<void> {
    // The database will automatically cascade delete:
    // 1. All messages in this conversation (via conversations -> messages FK)
    // 2. All excerpts from those messages (via messages -> excerpts FK)
    await db.delete(conversations).where(eq(conversations.id, id));
  },
};
