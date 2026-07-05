import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { data: result, error } = await supabase
      .from("messages")
      .select("*");

    if (error) throw error;

    // Format fields for frontend compatibility
    const formatted = (result || []).map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender_id,
      conversationId: msg.conversation_id,
      content: msg.content,
      createdAt: msg.created_at
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};