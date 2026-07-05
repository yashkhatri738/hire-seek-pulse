import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import {
  getMyConversations,
  findOrCreateConversation,
  getConversationMessages,
} from "@/lib/action/chat.action";
import ChatPageClient from "@/components/chat-page-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ receiverId?: string }>;
}

export default async function ChatPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  let activeConversationId: number | null = null;

  // If receiverId is present, find or create a conversation with that user
  if (params.receiverId) {
    const receiverId = params.receiverId;
    if (receiverId && receiverId !== user.id) {
      const result = await findOrCreateConversation(receiverId);
      if (result.status === "SUCCESS" && result.data) {
        activeConversationId = result.data;
      }
    }
  }

  // Fetch all conversations for sidebar
  const conversationsRes = await getMyConversations();
  const conversations = conversationsRes.data || [];

  // Pre-load messages for active conversation
  let initialMessages: any[] = [];
  if (activeConversationId) {
    const msgsRes = await getConversationMessages(activeConversationId);
    initialMessages = msgsRes.data || [];
  }

  return (
    <div className="-m-6 lg:-m-8">
      <ChatPageClient
        currentUser={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
        initialConversations={conversations}
        initialActiveConversationId={activeConversationId}
        initialMessages={initialMessages}
      />
    </div>
  );
}
