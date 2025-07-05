import { db } from './index';
import {
  conversations,
  messages,
  type NewConversation,
  type NewMessage,
} from './schema';
import { eq, desc } from 'drizzle-orm';

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
  async getAll() {
    return await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.updatedAt));
  },

  // Get a conversation by ID
  async getById(id: string) {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  },

  // Get a conversation by ID with associated messages using join
  async getByIdWithMessages(id: string) {
    const result = await db
      .select({
        conversation: conversations,
        message: messages,
      })
      .from(conversations)
      .leftJoin(messages, eq(conversations.id, messages.conversationId))
      .where(eq(conversations.id, id))
      .orderBy(messages.createdAt);

    if (result.length === 0) {
      return null;
    }

    // Extract conversation data (same for all rows)
    const conversation = result[0].conversation;

    // Extract and filter messages (remove null entries from left join)
    const conversationMessages = result
      .map(row => row.message)
      .filter(message => message !== null);

    return {
      ...conversation,
      messages: conversationMessages,
    };
  },

  // Update conversation title
  async updateTitle(id: string, title: string) {
    const [conversation] = await db
      .update(conversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation;
  },

  // Delete a conversation
  async delete(id: string) {
    await db.delete(conversations).where(eq(conversations.id, id));
  },
};

export const messageService = {
  // Create a new message
  async create(
    data: Omit<NewMessage, 'id' | 'createdAt'>
  ): Promise<NewMessage> {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  },

  // Get messages for a conversation
  async getByConversationId(conversationId: string) {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
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
