import { db } from "../config/db";
import { conversations, conversationMembers } from "../models/schema";
import { and, eq, inArray } from "drizzle-orm";

// find or create conversation between two users
export const findOrCreateConversation = async (
  user1: number,
  user2: number
) => {
  // 1. find conversations where user1 is a member
  const user1Convs = await db
    .select({ conversationId: conversationMembers.conversationId })
    .from(conversationMembers)
    .where(eq(conversationMembers.userId, user1));

  if (user1Convs.length > 0) {
    const convIds = user1Convs.map((c) => c.conversationId);

    // 2. check if user2 is also in any of those conversations
    const shared = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(
        and(
          inArray(conversationMembers.conversationId, convIds),
          eq(conversationMembers.userId, user2)
        )
      );

    if (shared.length > 0) {
      return shared[0].conversationId;
    }
  }

  // 3. create new conversation
  const [newConv] = await db
    .insert(conversations)
    .values({})
    .$returningId();

  const conversationId = newConv.id;

  // 4. add both users as members
  await db.insert(conversationMembers).values([
    { conversationId, userId: user1 },
    { conversationId, userId: user2 },
  ]);

  return conversationId;
};