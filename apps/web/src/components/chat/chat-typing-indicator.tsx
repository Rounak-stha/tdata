import { cn } from "@/lib/utils";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" style={{ animationDelay: "300ms" }} />
      <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" style={{ animationDelay: "600ms" }} />
    </div>
  );
}
