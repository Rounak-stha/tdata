"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowUpIcon, PaperclipIcon, MicIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile, useOrganizations } from "@/hooks";
import { useChatWithHistory } from "@/hooks/use-chat-with-history";

export function ChatInput() {
  const { organization } = useOrganizations();
  const { input, handleSubmit, handleInputChange, status } = useChatWithHistory(organization.id);
  const [inputRows, setInputRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      const rows = input.split("\n").length;
      setInputRows(Math.min(Math.max(1, rows), 5));
    }
  }, [input]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() !== "") {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="border-t p-4 sticky bottom-0 z-10">
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            rows={inputRows}
            className="min-h-[60px] w-full resize-none border-0 bg-transparent p-4 pr-24 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button type="button" size="icon" variant="ghost">
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost">
              <MicIcon className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={status == "submitted" || input.trim() === ""}
              className={cn(
                "h-8 w-8 rounded-md bg-primary/90 hover:bg-primary transition-colors shadow-md",
                (status == "submitted" || input.trim() === "") && "opacity-50 cursor-not-allowed",
              )}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <Separator />
        <div className="px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
          <span>
            {isMobile ? "Tap" : "Press"} <kbd className="px-1 py-0.5 bg-muted rounded text-muted-foreground">Enter</kbd> to send,{" "}
            <kbd className="px-1 py-0.5 bg-muted rounded text-muted-foreground">Shift + Enter</kbd> for new line
          </span>
        </div>
      </Card>
    </div>
  );
}
