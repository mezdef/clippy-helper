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
};
