import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core';

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Index for ordering conversations by most recently updated
    updatedAtIdx: index('conversations_updated_at_idx').on(table.updatedAt),
    // Index for ordering conversations by creation date
    createdAtIdx: index('conversations_created_at_idx').on(table.createdAt),
    // Index for searching conversations by title (useful for future search features)
    titleIdx: index('conversations_title_idx').on(table.title),
  })
);

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Index for finding messages by conversation (most common query)
    conversationIdIdx: index('messages_conversation_id_idx').on(
      table.conversationId
    ),
    // Composite index for conversation + creation time (for ordering messages in conversation)
    conversationCreatedAtIdx: index('messages_conversation_created_at_idx').on(
      table.conversationId,
      table.createdAt
    ),
    // Index for filtering by role (useful for analytics or specific queries)
    roleIdx: index('messages_role_idx').on(table.role),
    // Index for ordering messages by creation time
    createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
  })
);

export const excerpts = pgTable(
  'excerpts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    messageId: uuid('message_id')
      .references(() => messages.id, { onDelete: 'cascade' })
      .notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    order: text('order').notNull(), // To maintain the original order in the list
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Index for finding excerpts by message (most common query)
    messageIdIdx: index('excerpts_message_id_idx').on(table.messageId),
    // Composite index for message + order (for ordering excerpts within a message)
    messageOrderIdx: index('excerpts_message_order_idx').on(
      table.messageId,
      table.order
    ),
    // Index for searching excerpts by title
    titleIdx: index('excerpts_title_idx').on(table.title),
    // Index for ordering excerpts by creation time
    createdAtIdx: index('excerpts_created_at_idx').on(table.createdAt),
  })
);

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Excerpt = typeof excerpts.$inferSelect;
export type NewExcerpt = typeof excerpts.$inferInsert;

// Extended types for messages with excerpts
export type MessageWithExcerpts = Message & {
  excerpts: Excerpt[];
};
