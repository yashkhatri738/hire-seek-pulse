import { Server, Socket } from "socket.io";
import onlineUsers from "./onlineUsers";
import { saveMessage } from "../services/messageService";
import { findOrCreateConversation } from "../services/conversationService";

export const handleSocketEvents = (io: Server, socket: Socket) => {

  // User join
  socket.on("join", (userId: number | string) => {
    const id = userId.toString();
    onlineUsers.set(id, socket.id);
    console.log("✅ User joined:", id, "| Socket ID:", socket.id);
    console.log("📋 Online users:", Array.from(onlineUsers.keys()));
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    console.log("📨 Received sendMessage:", JSON.stringify(data, null, 2));
    const { senderId, receiverId, conversationId, content } = data;

    // Use provided conversationId or find/create one
    let convId = conversationId;
    if (!convId) {
      console.log("🔍 Finding/creating conversation between", senderId, "and", receiverId);
      convId = await findOrCreateConversation(senderId, receiverId);
      console.log("✅ Conversation ID:", convId);
    }

    const message = await saveMessage({
      senderId,
      conversationId: convId,
      content,
    });
    console.log("💾 Message saved:", JSON.stringify(message, null, 2));

    const receiverSocketId = onlineUsers.get(receiverId.toString());
    console.log("🔍 Looking for receiver:", receiverId, "| Socket ID:", receiverSocketId);
    console.log("📋 All online users:", Array.from(onlineUsers.entries()));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
      console.log("✅ Message sent to receiver socket:", receiverSocketId);
    } else {
      console.log("⚠️ Receiver not online:", receiverId);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("❌ User disconnected:", userId);
        break;
      }
    }
  });
};