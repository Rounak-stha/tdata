"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

export function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
