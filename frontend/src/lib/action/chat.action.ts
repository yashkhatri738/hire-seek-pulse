"use server";

import { getCurrentUser } from "./auth.quires";
import { createSupabaseServerClient } from "../supabase";

// Find or create a 1-on-1 conversation between the current user and receiverId
export const findOrCreateConversation = async (receiverId: number | string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR" as const, data: null };

    const senderId = user.id;
    const rId = receiverId.toString();

    const supabase = await createSupabaseServerClient();

    // Find conversations where the current user is a member
    const { data: myMemberships, error: memberError } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", senderId);

    if (memberError) throw memberError;

    if (myMemberships && myMemberships.length > 0) {
      const myConvIds = myMemberships.map((c) => c.conversation_id);

      // Check if receiverId is also in any of those conversations
      const { data: shared, error: sharedError } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .in("conversation_id", myConvIds)
        .eq("user_id", rId);

      if (sharedError) throw sharedError;

      if (shared && shared.length > 0) {
        return { status: "SUCCESS" as const, data: shared[0].conversation_id };
      }
    }

    // Create new conversation
    const { data: newConv, error: convError } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (convError || !newConv) {
      throw convError || new Error("Failed to create conversation");
    }

    const conversationId = newConv.id;

    // Add members
    const { error: membersError } = await supabase
      .from("conversation_members")
      .insert([
        { conversation_id: conversationId, user_id: senderId },
        { conversation_id: conversationId, user_id: rId }
      ]);

    if (membersError) throw membersError;

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

    const supabase = await createSupabaseServerClient();

    // Get all conversation ids for the current user
    const { data: myMemberships, error: memberError } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (memberError) throw memberError;

    if (!myMemberships || myMemberships.length === 0) {
      return { status: "SUCCESS" as const, data: [] };
    }

    const convIds = myMemberships.map((m) => m.conversation_id);

    // Get the OTHER member of each conversation with user details
    const { data: otherMembers, error: otherError } = await supabase
      .from("conversation_members")
      .select(`
        conversation_id,
        user_id,
        user:users (
          id,
          name,
          avatar_url,
          role
        )
      `)
      .in("conversation_id", convIds)
      .neq("user_id", user.id);

    if (otherError) throw otherError;

    // Get messages for these conversations to find the last message
    const { data: allMessages, error: msgsError } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false });

    if (msgsError) throw msgsError;

    const lastMessages = new Map<number, any>();
    for (const msg of (allMessages || [])) {
      if (!lastMessages.has(msg.conversation_id)) {
        lastMessages.set(msg.conversation_id, {
          id: msg.id,
          content: msg.content,
          senderId: msg.sender_id,
          createdAt: msg.created_at
        });
      }
    }

    // Combine conversation data
    const result = (otherMembers || []).map((member: any) => ({
      conversationId: member.conversation_id,
      user: {
        id: member.user.id,
        name: member.user.name,
        avatarUrl: member.user.avatar_url,
        role: member.user.role,
      },
      lastMessage: lastMessages.get(member.conversation_id) || null,
    }));

    // Sort by most recent message first
    result.sort((a: any, b: any) => {
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

    const supabase = await createSupabaseServerClient();

    // Verify user is a member of this conversation
    const { data: membership, error: memberError } = await supabase
      .from("conversation_members")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);

    if (memberError || !membership || membership.length === 0) {
      return { status: "ERROR" as const, data: [] };
    }

    const { data: msgs, error: msgsError } = await supabase
      .from("messages")
      .select(`
        id,
        conversation_id,
        sender_id,
        content,
        created_at,
        sender:users (
          name
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (msgsError) throw msgsError;

    const formatted = (msgs || []).map((msg: any) => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      senderId: msg.sender_id,
      content: msg.content,
      createdAt: msg.created_at,
      senderName: msg.sender?.name || null
    }));

    return { status: "SUCCESS" as const, data: formatted };
  } catch (error) {
    console.error("getConversationMessages error:", error);
    return { status: "ERROR" as const, data: [] };
  }
};
