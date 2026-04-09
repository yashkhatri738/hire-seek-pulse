import { db } from "../config/db";
import { conversations, conversationMembers } from "../models/schema";
import { and, eq } from "drizzle-orm";

// find or create conversation
export const findOrCreateConversation = async (
  user1: number,
  user2: number
) => {
  // 1. find common conversation
  const existing = await db
    .select()
    .from(conversationMembers)
    .where(
      eq(conversationMembers.userId, user1)
    );

  // simple logic (improve later)
  if (existing.length > 0) {
    return existing[0].conversationId;
  }

  // 2. create new conversation
  const [newConv] = await db
    .insert(conversations)
    .values({})
    .$returningId();

  const conversationId = newConv.id;

  // 3. add both users
  await db.insert(conversationMembers).values([
    { conversationId, userId: user1 },
    { conversationId, userId: user2 },
  ]);

  return conversationId;
};