"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import {
  getMyConversations,
  getConversationMessages,
} from "@/lib/action/chat.action";
import { format } from "date-fns";
import {
  Send,
  MessageSquare,
  Search,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ConversationItem = {
  conversationId: number;
  user: {
    id: number;
    name: string;
    avatarUrl: string | null;
    role: string;
  };
  lastMessage: {
    id: number;
    content: string;
    senderId: number;
    createdAt: string | Date | null;
  } | null;
};

type MessageItem = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string | Date | null;
  senderName: string | null;
};

type ChatPageClientProps = {
  currentUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  initialConversations: ConversationItem[];
  initialActiveConversationId: number | null;
  initialMessages: MessageItem[];
};

export default function ChatPageClient({
  currentUser,
  initialConversations,
  initialActiveConversationId,
  initialMessages,
}: ChatPageClientProps) {
  const [conversations, setConversations] =
    useState<ConversationItem[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(initialActiveConversationId);
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(
    !initialActiveConversationId
  );
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConvRef = useRef(activeConversationId);

  // Keep the ref in sync
  activeConvRef.current = activeConversationId;

  const activeConversation = conversations.find(
    (c) => c.conversationId === activeConversationId
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket connection — one-time setup
  useEffect(() => {
    socket.connect();
    socket.emit("join", currentUser.id);

    socket.on("receiveMessage", (msg: any) => {
      // If the message is for the currently active conversation, add it
      if (msg.conversationId === activeConvRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            conversationId: msg.conversationId,
            senderId: msg.senderId,
            content: msg.content,
            createdAt: msg.createdAt,
            senderName: null,
          },
        ]);
      }

      // Update conversation sidebar's last message
      setConversations((prev) => {
        const existing = prev.find(
          (c) => c.conversationId === msg.conversationId
        );
        if (existing) {
          return prev.map((c) =>
            c.conversationId === msg.conversationId
              ? {
                  ...c,
                  lastMessage: {
                    id: msg.id,
                    content: msg.content,
                    senderId: msg.senderId,
                    createdAt: msg.createdAt,
                  },
                }
              : c
          );
        } else {
          // New conversation from someone new — refetch sidebar
          refreshConversations();
          return prev;
        }
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const refreshConversations = async () => {
    const res = await getMyConversations();
    if (res.data) setConversations(res.data);
  };

  const selectConversation = async (conversationId: number) => {
    setActiveConversationId(conversationId);
    setShowMobileSidebar(false);
    setLoadingMessages(true);
    const res = await getConversationMessages(conversationId);
    if (res.data) setMessages(res.data);
    setLoadingMessages(false);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !activeConversationId || !activeConversation)
      return;

    const msgData = {
      senderId: currentUser.id,
      receiverId: activeConversation.user.id,
      conversationId: activeConversationId,
      content: messageInput,
    };

    socket.emit("sendMessage", msgData);

    // Optimistic update — add message locally
    const newMsg: MessageItem = {
      id: Date.now(),
      conversationId: activeConversationId,
      senderId: currentUser.id,
      content: messageInput,
      createdAt: new Date().toISOString(),
      senderName: currentUser.name,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Update sidebar last message
    setConversations((prev) =>
      prev.map((c) =>
        c.conversationId === activeConversationId
          ? {
              ...c,
              lastMessage: {
                id: newMsg.id,
                content: messageInput,
                senderId: currentUser.id,
                createdAt: new Date().toISOString(),
              },
            }
          : c
      )
    );

    setMessageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (date: string | Date | null) => {
    if (!date) return "";
    try {
      return format(new Date(date), "h:mm a");
    } catch {
      return "";
    }
  };

  const formatSidebarTime = (date: string | Date | null) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return format(d, "h:mm a");
      if (days === 1) return "Yesterday";
      if (days < 7) return format(d, "EEEE");
      return format(d, "MM/dd/yyyy");
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden rounded-lg border">
      {/* ───── Sidebar ───── */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r flex flex-col bg-card shrink-0",
          showMobileSidebar ? "flex" : "hidden md:flex"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b shrink-0">
          <h2 className="text-xl font-bold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => selectConversation(conv.conversationId)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
                    activeConversationId === conv.conversationId &&
                      "bg-primary/5 border-l-2 border-l-primary"
                  )}
                >
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage src={conv.user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {conv.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-sm truncate">
                        {conv.user.name}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                        {formatSidebarTime(
                          conv.lastMessage?.createdAt || null
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage
                        ? conv.lastMessage.senderId === currentUser.id
                          ? `You: ${conv.lastMessage.content}`
                          : conv.lastMessage.content
                        : "No messages yet"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ───── Main Chat Area ───── */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !showMobileSidebar ? "flex" : "hidden md:flex"
        )}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b flex items-center gap-3 px-4 bg-card shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0"
                onClick={() => setShowMobileSidebar(true)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={activeConversation.user.avatarUrl || undefined}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {activeConversation.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">
                  {activeConversation.user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {activeConversation.user.role}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3 max-w-3xl mx-auto">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No messages yet. Say hello!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isSelf = msg.senderId === currentUser.id;
                      return (
                        <div
                          key={msg.id || i}
                          className={cn(
                            "flex",
                            isSelf ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                              isSelf
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            <p
                              className={cn(
                                "text-[10px] mt-1",
                                isSelf
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card shrink-0">
              <div className="flex items-center gap-2 max-w-3xl mx-auto">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  size="icon"
                  disabled={!messageInput.trim()}
                  className="shrink-0 gradient-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No conversation selected — placeholder */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-muted-foreground max-w-sm">
              Select a conversation from the sidebar or message someone from the
              applications page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
