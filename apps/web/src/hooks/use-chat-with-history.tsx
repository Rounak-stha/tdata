"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useChat as useAIChat, type Message } from "@ai-sdk/react";
import { ApiPaths } from "@/lib/constants";

export function useChatWithHistory(organizationId: number, chatId?: string) {
  // Use the AI SDK's useChat hook
  const chatHelpers = useAIChat({
    id: chatId || "New Chat",
    initialMessages: [],
    api: ApiPaths.chat(),
  });

  // State to manage whether to show sample messages or real chat
  const [showingSamples, setShowingSamples] = useState(true);

  // Combined messages - either samples or real chat
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);

  // When user sends first message, switch to real chat
  useEffect(() => {
    if (chatHelpers.messages.length > 0 && showingSamples) {
      setShowingSamples(false);
      setDisplayMessages(chatHelpers.messages);
    } else if (!showingSamples) {
      setDisplayMessages(chatHelpers.messages);
    }
  }, [chatHelpers.messages, showingSamples]);

  // Custom submit handler to handle the transition from samples to real chat
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (showingSamples) {
      setShowingSamples(false);
    }
    chatHelpers.handleSubmit(e);
  };

  return {
    ...chatHelpers,
    messages: displayMessages,
    handleSubmit,
  };
}
