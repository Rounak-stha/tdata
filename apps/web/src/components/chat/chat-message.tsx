"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "ai";
import { formatDistanceToNow } from "date-fns";
// import { FunctionResultDisplay } from "./function-result-display"
import { useUser } from "@/hooks";
import { ChatTaskAssignedTaskList } from "./function-result-display";
import { MemoizedMarkdown } from "./markdown";

interface ChatMessageProps {
  message: Message;
  isStreaming: boolean;
  isLastMessage: boolean;
}

export function ChatMessage({ message, isStreaming, isLastMessage }: ChatMessageProps) {
  const [renderedContent, setRenderedContent] = useState("");
  const [isFullyRendered, setIsFullyRendered] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const messageContentRef = useRef("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useUser();
  const timestamp = new Date();
  const isUser = message.role === "user";
  // const isFunction = message.role === "function"

  useEffect(() => {
    // Update messageContentRef whenever the message content grows
    messageContentRef.current = message.content;

    if (isUser || !isStreaming || !isLastMessage) {
      setRenderedContent(message.content);
      return;
    }

    // Start interval only if not already running
    if (intervalRef.current) return;

    setIsFullyRendered(false);
    intervalRef.current = setInterval(() => {
      setRenderedContent((prev) => {
        const nextChar = messageContentRef.current[prev.length];
        if (nextChar) return prev + nextChar;

        // Stop interval if fully rendered
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsFullyRendered(true);
        return prev;
      });
    }, 16); // ~60fps (adjust for speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [message.content]);

  return (
    <div className="group mb-6 last:mb-0">
      {/* Message header with timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar src={isUser ? user.imageUrl : ""} alt={isUser ? "User Avatar" : "AI Avatar"} />
          <span className="font-medium text-sm text-gray-300">{isUser ? "You" : "AI Assistant"}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
      </div>

      {/* Message content */}
      <div className={cn("ml-9")}>
        <div ref={contentRef} className="whitespace-pre-wrap tracking-wide">
          {renderedContent}
          {!isFullyRendered && !isUser && <span className="inline-block w-1 h-4 ml-0.5 bg-[#3b82f6] animate-pulse" />}
        </div>
      </div>
      <div className={cn("ml-9")}>
        {message.parts?.map((part, index) => {
          switch (part.type) {
            case "tool-invocation": {
              switch (part.toolInvocation.toolName) {
                case "getMyTasks":
                  switch (part.toolInvocation.state) {
                    case "call":
                      return <div key={index}>Getting your tasks...</div>;
                    case "result":
                      return <ChatTaskAssignedTaskList key={index} tasks={part.toolInvocation.result} />;
                  }
              }
            }
          }
        })}
      </div>
    </div>
  );
}
