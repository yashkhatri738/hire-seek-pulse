import { db } from "../config/db";
import { messages } from "../models/schema";

export const saveMessage = async (data: any) => {
  const { senderId, conversationId, content } = data;

  await db.insert(messages).values({
    senderId,
    conversationId,
    content,
  });

  return data;
};