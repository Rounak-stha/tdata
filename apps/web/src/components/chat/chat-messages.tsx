"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/chat-message";
import { EmptyChat } from "@/components/chat/empty-chat";
import { TypingIndicator } from "./chat-typing-indicator";
import { Avatar } from "../ui/avatar";
import { useOrganizations } from "@/hooks";
import { useChatWithHistory } from "@/hooks/use-chat-with-history";

export function ChatMessages() {
  const { organization } = useOrganizations();
  const { messages, status } = useChatWithHistory(organization.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-20">
        {messages.length === 0 ? (
          <EmptyChat />
        ) : (
          messages.map((message, index) => <ChatMessage key={message.id} message={message} isStreaming={status == "streaming"} isLastMessage={index == messages.length - 1} />)
        )}
        {/* Loading indicator */}
        {status == "submitted" && (
          <div className="group mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Avatar fallbackText="S" alt="System Avatar" />
                <span className="font-medium text-sm text-gray-300">AI Assistant</span>
              </div>
            </div>

            <div className="relative ml-9 p-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-[#1a1a1a] to-[#1c1c1c] rounded-tl-none border border-[#2a2a2a]/50 min-h-[56px]">
              <div className="absolute top-0 w-3 h-3 transform rotate-45 bg-[#1a1a1a] left-[calc(100%-12px)] border-l border-t border-[#2a2a2a]/50" />
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
