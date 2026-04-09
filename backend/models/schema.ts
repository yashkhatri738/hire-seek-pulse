import {
  mysqlTable,
  int,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

// Conversations
export const conversations = mysqlTable("conversations", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Members
export const conversationMembers = mysqlTable("conversation_members", {
  id: int("id").primaryKey().autoincrement(),

  conversationId: int("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),

  userId: int("user_id")
    .notNull(),
});

// Messages
export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),

  conversationId: int("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),

  senderId: int("sender_id").notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});