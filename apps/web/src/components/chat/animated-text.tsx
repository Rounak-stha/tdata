"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
}

export function AnimatedText({ text, isStreaming, className }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [animatingChunk, setAnimatingChunk] = useState("");
  const previousTextRef = useRef("");

  useEffect(() => {
    // If the text has changed, find the new chunk
    if (text !== previousTextRef.current) {
      const newChunk = text.slice(previousTextRef.current.length);

      // Update the display text with the previous text
      setDisplayText(previousTextRef.current);

      // Set the animating chunk to the new text
      setAnimatingChunk(newChunk);

      // After a brief delay, update the display text to include the new chunk
      // This creates a smooth animation effect
      const timeoutId = setTimeout(() => {
        setDisplayText(text);
        setAnimatingChunk("");
        previousTextRef.current = text;
      }, 300); // Duration of the animation

      return () => clearTimeout(timeoutId);
    }

    previousTextRef.current = text;
  }, [text]);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {displayText}
      {animatingChunk && (
        <span className="animate-fadeIn opacity-0" style={{ animationFillMode: "forwards" }}>
          {animatingChunk}
        </span>
      )}
      {isStreaming && <span className="inline-block w-1 h-4 ml-0.5 bg-[#3b82f6] animate-pulse" />}
    </span>
  );
}
