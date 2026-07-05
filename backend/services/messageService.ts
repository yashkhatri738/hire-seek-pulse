import { supabase } from "../config/supabase";

export const saveMessage = async (data: {
  senderId: number | string;
  conversationId: number;
  content: string;
}) => {
  const { senderId, conversationId, content } = data;

  const { data: inserted, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId.toString(),
      conversation_id: conversationId,
      content,
    })
    .select()
    .single();

  if (error || !inserted) {
    throw error || new Error("Failed to save message");
  }

  return {
    id: inserted.id,
    senderId: inserted.sender_id,
    conversationId: inserted.conversation_id,
    content: inserted.content,
    createdAt: inserted.created_at,
  };
};