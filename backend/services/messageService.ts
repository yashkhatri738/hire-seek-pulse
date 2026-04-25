import { db } from "../config/db";
import { messages } from "../models/schema";

export const saveMessage = async (data: {
  senderId: number;
  conversationId: number;
  content: string;
}) => {
  const { senderId, conversationId, content } = data;

  const [inserted] = await db
    .insert(messages)
    .values({
      senderId,
      conversationId,
      content,
    })
    .$returningId();

  return {
    id: inserted.id,
    senderId,
    conversationId,
    content,
    createdAt: new Date().toISOString(),
  };
};