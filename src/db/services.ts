import { db } from './index';
import {
  conversations,
  messages,
  excerpts,
  type NewConversation,
  type NewMessage,
  type NewExcerpt,
  type Message,
  type Excerpt,
  type MessageWithExcerpts,
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

  // Get a conversation by ID with associated messages and excerpts using joins
  async getByIdWithMessages(id: string) {
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

export const excerptService = {
  // Create a new excerpt
  async create(
    data: Omit<NewExcerpt, 'id' | 'createdAt'>
  ): Promise<NewExcerpt> {
    const [excerpt] = await db.insert(excerpts).values(data).returning();
    return excerpt;
  },

  // Create multiple excerpts for a message
  async createMany(
    messageId: string,
    items: Array<{ title: string; content: string }>
  ) {
    const excerptData = items.map((item, index) => ({
      messageId,
      title: item.title,
      content: item.content,
      order: index.toString(),
    }));

    const result = await db.insert(excerpts).values(excerptData).returning();
    return result;
  },

  // Save excerpts from AI response
  async saveFromAiResponse(messageId: string, aiResponse: any) {
    if (
      aiResponse?.list &&
      Array.isArray(aiResponse.list) &&
      aiResponse.list.length > 0
    ) {
      return await this.createMany(messageId, aiResponse.list);
    }
    return [];
  },

  // Get excerpts for a message
  async getByMessageId(messageId: string) {
    return await db
      .select()
      .from(excerpts)
      .where(eq(excerpts.messageId, messageId))
      .orderBy(excerpts.order);
  },

  // Get a single excerpt by ID
  async getById(id: string) {
    const [excerpt] = await db
      .select()
      .from(excerpts)
      .where(eq(excerpts.id, id));
    return excerpt;
  },

  // Delete an excerpt
  async delete(id: string) {
    await db.delete(excerpts).where(eq(excerpts.id, id));
  },

  // Delete all excerpts for a message
  async deleteByMessageId(messageId: string) {
    await db.delete(excerpts).where(eq(excerpts.messageId, messageId));
  },

  // Update an excerpt
  async update(id: string, data: Partial<NewExcerpt>) {
    const [excerpt] = await db
      .update(excerpts)
      .set(data)
      .where(eq(excerpts.id, id))
      .returning();
    return excerpt;
  },
};
