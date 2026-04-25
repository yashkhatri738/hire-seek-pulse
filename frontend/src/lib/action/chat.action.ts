"use server";

import { db } from "@/config/db";
import {
  conversations,
  conversationMembers,
  messages,
  users,
} from "@/drizzle/schema";
import { eq, and, desc, inArray, ne } from "drizzle-orm";
import { getCurrentUser } from "./auth.quires";

// Find or create a 1-on-1 conversation between the current user and receiverId
export const findOrCreateConversation = async (receiverId: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR" as const, data: null };

    const senderId = user.id;

    // Find conversations where the current user is a member
    const myConversations = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(eq(conversationMembers.userId, senderId));

    if (myConversations.length > 0) {
      const myConvIds = myConversations.map((c) => c.conversationId);

      // Check if receiverId is also in any of those conversations
      const shared = await db
        .select({ conversationId: conversationMembers.conversationId })
        .from(conversationMembers)
        .where(
          and(
            inArray(conversationMembers.conversationId, myConvIds),
            eq(conversationMembers.userId, receiverId)
          )
        );

      if (shared.length > 0) {
        return { status: "SUCCESS" as const, data: shared[0].conversationId };
      }
    }

    // Create new conversation
    const [newConv] = await db
      .insert(conversations)
      .values({})
      .$returningId();
    const conversationId = newConv.id;

    await db.insert(conversationMembers).values([
      { conversationId, userId: senderId },
      { conversationId, userId: receiverId },
    ]);

    return { status: "SUCCESS" as const, data: conversationId };
  } catch (error) {
    console.error("findOrCreateConversation error:", error);
    return { status: "ERROR" as const, data: null };
  }
};

// Get all conversations for the current user (with other user info + last message)
export const getMyConversations = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR" as const, data: [] };

    // Get all conversation ids for the current user
    const myMemberships = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(eq(conversationMembers.userId, user.id));

    if (myMemberships.length === 0)
      return { status: "SUCCESS" as const, data: [] };

    const convIds = myMemberships.map((m) => m.conversationId);

    // Get the OTHER member of each conversation with user details
    const otherMembers = await db
      .select({
        conversationId: conversationMembers.conversationId,
        userId: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(conversationMembers)
      .innerJoin(users, eq(users.id, conversationMembers.userId))
      .where(
        and(
          inArray(conversationMembers.conversationId, convIds),
          ne(conversationMembers.userId, user.id)
        )
      );

    // Get last message for each conversation (fetch recent messages, group in JS)
    const allMessages = await db
      .select()
      .from(messages)
      .where(inArray(messages.conversationId, convIds))
      .orderBy(desc(messages.createdAt));

    const lastMessages = new Map<number, (typeof allMessages)[0]>();
    for (const msg of allMessages) {
      if (!lastMessages.has(msg.conversationId)) {
        lastMessages.set(msg.conversationId, msg);
      }
    }

    // Combine conversation data
    const result = otherMembers.map((member) => ({
      conversationId: member.conversationId,
      user: {
        id: member.userId,
        name: member.name,
        avatarUrl: member.avatarUrl,
        role: member.role,
      },
      lastMessage: lastMessages.get(member.conversationId) || null,
    }));

    // Sort by most recent message first
    result.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const bTime = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return bTime - aTime;
    });

    return { status: "SUCCESS" as const, data: result };
  } catch (error) {
    console.error("getMyConversations error:", error);
    return { status: "ERROR" as const, data: [] };
  }
};

// Get all messages for a specific conversation (with authorization check)
export const getConversationMessages = async (conversationId: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR" as const, data: [] };

    // Verify user is a member of this conversation
    const membership = await db
      .select()
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, conversationId),
          eq(conversationMembers.userId, user.id)
        )
      );

    if (membership.length === 0)
      return { status: "ERROR" as const, data: [] };

    const msgs = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        createdAt: messages.createdAt,
        senderName: users.name,
      })
      .from(messages)
      .leftJoin(users, eq(users.id, messages.senderId))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return { status: "SUCCESS" as const, data: msgs };
  } catch (error) {
    console.error("getConversationMessages error:", error);
    return { status: "ERROR" as const, data: [] };
  }
};
