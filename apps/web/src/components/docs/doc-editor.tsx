"use client";

import { useRef } from "react";
import { EditorBubble, EditorBubbleItem, EditorCommand, EditorCommandItem, EditorContent, EditorRoot } from "novel";

interface EditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function DocumentEditor() {
  return (
    <div className="min-h-[500px] w-full">
      <EditorRoot>
        <EditorContent></EditorContent>
      </EditorRoot>
    </div>
  );
}
