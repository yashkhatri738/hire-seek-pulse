import { Server, Socket } from "socket.io";
import onlineUsers from "./onlineUsers";
import { saveMessage } from "../services/messageService";
import { findOrCreateConversation } from "../services/conversationService";

export const handleSocketEvents = (io: Server, socket: Socket) => {

  // User join
  socket.on("join", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    console.log("User joined:", userId);
  });

  // Send message
  socket.on("sendMessage", async (data) => {
  const { senderId, receiverId, content } = data;

  // 🔥 get conversation
  const conversationId = await findOrCreateConversation(
    senderId,
    receiverId
  );

  const message = await saveMessage({
    senderId,
    conversationId,
    content,
  });

  const receiverSocketId = onlineUsers.get(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", message);
  }
});

  // Disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
};