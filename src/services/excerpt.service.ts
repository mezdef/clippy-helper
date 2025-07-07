import { db } from '@/db';
import { excerpts, type NewExcerpt } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { AdviceList } from '@/types';

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
  ): Promise<NewExcerpt[]> {
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
  async saveFromAiResponse(
    messageId: string,
    aiResponse: AdviceList
  ): Promise<NewExcerpt[]> {
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
  async getByMessageId(messageId: string): Promise<NewExcerpt[]> {
    return await db
      .select()
      .from(excerpts)
      .where(eq(excerpts.messageId, messageId))
      .orderBy(excerpts.order);
  },

  // Get a single excerpt by ID
  async getById(id: string): Promise<NewExcerpt | undefined> {
    const [excerpt] = await db
      .select()
      .from(excerpts)
      .where(eq(excerpts.id, id));
    return excerpt;
  },

  // Delete an excerpt
  async delete(id: string): Promise<void> {
    await db.delete(excerpts).where(eq(excerpts.id, id));
  },

  // Delete all excerpts for a message
  async deleteByMessageId(messageId: string): Promise<void> {
    await db.delete(excerpts).where(eq(excerpts.messageId, messageId));
  },

  // Update an excerpt
  async update(id: string, data: Partial<NewExcerpt>): Promise<NewExcerpt> {
    const [excerpt] = await db
      .update(excerpts)
      .set(data)
      .where(eq(excerpts.id, id))
      .returning();
    return excerpt;
  },
};
