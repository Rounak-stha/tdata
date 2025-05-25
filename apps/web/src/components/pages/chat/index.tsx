"use client";

import { SWRConfig } from "swr";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

/**
 * There seems to be a bug in the  @ai-sdk/react package when we have a custom fetcher defined in the SWRConfig
 * where multiple failed requests are sent to the chat api route
 * GET /api/5/chat,irNGKsNJ3zMr3RWu,streamData 404 in 1023ms
 * GET /api/5/chat,irNGKsNJ3zMr3RWu,status 404 in 1081ms
 * GET /api/5/chat,irNGKsNJ3zMr3RWu,error 404 in 1082ms
 *
 * The temp fix is to remove that fetcher just for the chat page
 * The downside is that we can;t use the global fetcher defined in this page (we don't have the need for that right now, so its acceptable for now)
 *
 * Track this issue for any future fix: https://github.com/vercel/ai/issues/3214
 */

export function ChatPage() {
  return (
    <SWRConfig value={{ fetcher: undefined }}>
      <TempChatPage />
    </SWRConfig>
  );
}

function TempChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
