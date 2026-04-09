"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type Message = {
  senderId: number;
  content: string;
};

type ChatProps = {
  userId: number;
  receiverId: number;
};

const Chat = ({ userId, receiverId }: ChatProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.connect();

    socket.emit("join", userId);

    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      senderId: userId,
      receiverId,
      content: message,
    };

    socket.emit("sendMessage", msgData);

    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.senderId === userId ? "Me" : "Other"}:</b> {msg.content}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;