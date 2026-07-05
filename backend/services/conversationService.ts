import { supabase } from "../config/supabase";

// find or create conversation between two users
export const findOrCreateConversation = async (
  user1: number | string,
  user2: number | string
) => {
  const u1 = user1.toString();
  const u2 = user2.toString();

  // 1. find conversations where user1 is a member
  const { data: user1Convs, error: member1Error } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("user_id", u1);

  if (member1Error) throw member1Error;

  if (user1Convs && user1Convs.length > 0) {
    const convIds = user1Convs.map((c: any) => c.conversation_id);

    // 2. check if user2 is also in any of those conversations
    const { data: shared, error: sharedError } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .in("conversation_id", convIds)
      .eq("user_id", u2);

    if (sharedError) throw sharedError;

    if (shared && shared.length > 0) {
      return shared[0].conversation_id;
    }
  }

  // 3. create new conversation
  const { data: newConv, error: convError } = await supabase
    .from("conversations")
    .insert({})
    .select()
    .single();

  if (convError || !newConv) {
    throw convError || new Error("Failed to create conversation");
  }

  const conversationId = newConv.id;

  // 4. add both users as members
  const { error: insertMembersError } = await supabase
    .from("conversation_members")
    .insert([
      { conversation_id: conversationId, user_id: u1 },
      { conversation_id: conversationId, user_id: u2 },
    ]);

  if (insertMembersError) throw insertMembersError;

  return conversationId;
};